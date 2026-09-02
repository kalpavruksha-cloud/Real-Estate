"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rateLimit";
import { createEnquiry } from "@/services/enquiryService";
import { createSiteVisit } from "@/services/siteVisitService";
import { createRequirement } from "@/services/requirementService";
import { createOwnerLead } from "@/services/ownerLeadService";
import { uploadToDrive } from "@/lib/google/drive";

async function ensureAllowed() {
  const forwarded = (await headers()).get("x-forwarded-for") || "local";
  if (!rateLimit(forwarded)) throw new Error("Too many submissions. Please try again shortly.");
}

export async function submitEnquiry(form: FormData) {
  await ensureAllowed();
  await createEnquiry(Object.fromEntries(form));
  redirect(`/thank-you?type=enquiry`);
}

export async function submitSiteVisit(form: FormData) {
  await ensureAllowed();
  await createSiteVisit(Object.fromEntries(form));
  redirect(`/thank-you?type=site-visit`);
}

export async function submitRequirement(form: FormData) {
  await ensureAllowed();
  await createRequirement(Object.fromEntries(form));
  redirect(`/thank-you?type=requirement`);
}

export async function submitOwnerLead(form: FormData) {
  await ensureAllowed();
  const files = form.getAll("Images").filter((item): item is File => item instanceof File && item.size > 0);
  const uploads = [];
  for (const file of files) uploads.push(await uploadToDrive(file, "owner-lead"));
  await createOwnerLead(Object.fromEntries(form), uploads.map((item) => item.url).join(", "));
  redirect(`/thank-you?type=owner-listing`);
}
