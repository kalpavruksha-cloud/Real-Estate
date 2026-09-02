"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession, requireAdmin, verifyPassword } from "@/lib/auth/session";
import { archiveProperty, createProperty, duplicateProperty, updateProperty } from "@/services/propertyService";
import { deletePropertyImage, updatePropertyImage, uploadPropertyImage } from "@/services/imageService";
import { updateEnquiry } from "@/services/enquiryService";
import { updateSiteVisit } from "@/services/siteVisitService";
import { updateRequirement } from "@/services/requirementService";
import { convertOwnerLeadToProperty, updateOwnerLead } from "@/services/ownerLeadService";
import { saveLookup } from "@/services/lookupService";
import { updateSettings } from "@/services/settingsService";
import { settingsSchema } from "@/schemas/lookups";

export async function loginAction(form: FormData) {
  const email = String(form.get("email") || "");
  const password = String(form.get("password") || "");
  const next = String(form.get("next") || "/admin");
  if (!(await verifyPassword(email, password))) {
    redirect(`/admin/login?error=invalid&next=${encodeURIComponent(next)}`);
  }
  await createSession();
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function createPropertyAction(form: FormData) {
  const user = await requireAdmin();
  const property = await createProperty(form, user.email);
  redirect(`/admin/properties/${property.PropertyID}/edit`);
}

export async function updatePropertyAction(form: FormData) {
  await requireAdmin();
  const property = await updateProperty(form);
  redirect(`/admin/properties/${property.PropertyID}/edit?saved=1`);
}

export async function archivePropertyAction(form: FormData) {
  await requireAdmin();
  await archiveProperty(String(form.get("PropertyID")));
  redirect("/admin/properties");
}

export async function duplicatePropertyAction(form: FormData) {
  const user = await requireAdmin();
  const property = await duplicateProperty(String(form.get("PropertyID")), user.email);
  redirect(`/admin/properties/${property.PropertyID}/edit`);
}

export async function uploadImagesAction(form: FormData) {
  await requireAdmin();
  const propertyId = String(form.get("PropertyID"));
  const alt = String(form.get("AltText") || "");
  const main = String(form.get("ImageType") || "Gallery") as "Main" | "Gallery";
  const files = form.getAll("Images").filter((item): item is File => item instanceof File && item.size > 0);
  for (const file of files) await uploadPropertyImage(propertyId, file, alt, main);
  redirect(`/admin/properties/${propertyId}/edit?images=1`);
}

export async function updateImageAction(form: FormData) {
  await requireAdmin();
  await updatePropertyImage(String(form.get("ImageID")), {
    AltText: String(form.get("AltText") || ""),
    ImageOrder: Number(form.get("ImageOrder") || 0),
    ImageType: String(form.get("ImageType") || "Gallery") as "Main" | "Gallery"
  });
  redirect(`/admin/properties/${String(form.get("PropertyID"))}/edit?images=1`);
}

export async function deleteImageAction(form: FormData) {
  await requireAdmin();
  await deletePropertyImage(String(form.get("ImageID")));
  redirect(`/admin/properties/${String(form.get("PropertyID"))}/edit?images=1`);
}

export async function updateEnquiryAction(form: FormData) {
  await requireAdmin();
  await updateEnquiry(Object.fromEntries(form));
  redirect("/admin/enquiries?saved=1");
}

export async function updateSiteVisitAction(form: FormData) {
  await requireAdmin();
  await updateSiteVisit(Object.fromEntries(form));
  redirect("/admin/site-visits?saved=1");
}

export async function updateRequirementAction(form: FormData) {
  await requireAdmin();
  await updateRequirement(Object.fromEntries(form));
  redirect("/admin/requirements?saved=1");
}

export async function updateOwnerLeadAction(form: FormData) {
  await requireAdmin();
  await updateOwnerLead(Object.fromEntries(form));
  redirect("/admin/owner-leads?saved=1");
}

export async function saveLookupAction(tab: "LOCATIONS" | "CATEGORIES" | "AMENITIES", form: FormData) {
  await requireAdmin();
  await saveLookup(tab, form);
  const path = tab === "LOCATIONS" ? "locations" : tab === "CATEGORIES" ? "categories" : "amenities";
  redirect(`/admin/${path}?saved=1`);
}

export async function updateSettingsAction(form: FormData) {
  await requireAdmin();
  const parsed = settingsSchema.parse(Object.fromEntries(form));
  await updateSettings(parsed);
  redirect("/admin/settings?saved=1");
}

export async function convertOwnerLeadAction(form: FormData) {
  const user = await requireAdmin();
  const property = await convertOwnerLeadToProperty(String(form.get("OwnerLeadID")), user.email);
  redirect(`/admin/properties/${property.PropertyID}/edit`);
}