import { revalidateTag, unstable_cache as cache } from "next/cache";
import { IMAGE_HEADERS, PROPERTY_HEADERS, SHEETS } from "@/lib/constants";
import { appendSheetRow, readSheet, updateSheetRowById } from "@/lib/google/sheets";
import { deleteFromDrive, uploadToDrive } from "@/lib/google/drive";
import { nextId } from "@/lib/utils";
import type { PropertyImage } from "@/types";

export const getImagesForProperty = cache(
  async (propertyId: string) => {
    const rows = (await readSheet(SHEETS.images)) as unknown as PropertyImage[];
    return rows
      .filter((image) => image.PropertyID === propertyId && image.Active !== "No")
      .sort((a, b) => Number(a.ImageOrder || 0) - Number(b.ImageOrder || 0));
  },
  ["property-images"],
  { revalidate: 300, tags: ["properties"] }
);

export async function uploadPropertyImage(propertyId: string, file: File, altText: string, type: "Main" | "Gallery" = "Gallery") {
  const all = (await readSheet(SHEETS.images)) as unknown as PropertyImage[];
  const image = await uploadToDrive(file, propertyId);
  const propertyImages = all.filter((row) => row.PropertyID === propertyId);
  const row: PropertyImage = {
    ImageID: nextId(all.map((item) => item.ImageID), "IMG", 6),
    PropertyID: propertyId,
    ImageURL: image.url,
    ImageOrder: propertyImages.length + 1,
    AltText: altText || `${propertyId} property image`,
    ImageType: type,
    Active: "Yes",
    Notes: image.storageId
  };
  await appendSheetRow(SHEETS.images, IMAGE_HEADERS, row as unknown as Record<string, unknown>);
  if (type === "Main") {
    await updateSheetRowById(SHEETS.properties, PROPERTY_HEADERS, "PropertyID", propertyId, { MainImage: image.url });
  }
  revalidateTag("properties", "max");
  return row;
}

export async function updatePropertyImage(imageId: string, patch: Partial<PropertyImage>) {
  await updateSheetRowById(SHEETS.images, IMAGE_HEADERS, "ImageID", imageId, patch);
  revalidateTag("properties", "max");
}

export async function deletePropertyImage(imageId: string) {
  const rows = (await readSheet(SHEETS.images)) as unknown as PropertyImage[];
  const image = rows.find((row) => row.ImageID === imageId);
  if (image?.Notes) {
    await deleteFromDrive(image.Notes).catch(() => undefined);
  }
  await updateSheetRowById(SHEETS.images, IMAGE_HEADERS, "ImageID", imageId, { Active: "No" });
  revalidateTag("properties", "max");
}


