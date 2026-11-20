import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { env } from "@/lib/config";
import { getPublishedProperties } from "@/services/propertyService";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const properties = await getPublishedProperties();
  return [
    "",
    "/properties",
    "/properties/sale",
    "/properties/rent",
    "/list-property",
    "/property-requirement",
    "/about",
    "/contact",
    ...properties.map((property) => `/property/${property.Slug}`)
  ].map((url) => ({
    url: `${env.siteUrl}${url}`,
    lastModified: new Date()
  }));
}
