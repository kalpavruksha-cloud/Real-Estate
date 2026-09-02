import { z } from "zod";
import { CATEGORIES, LEAD_STATUSES, OWNER_STATUSES, PURPOSES, VISIT_STATUSES } from "@/lib/constants";

const phone = z.string().trim().min(7, "Enter a valid phone number").max(20);
const email = z.string().trim().email("Enter a valid email").or(z.literal("")).optional().default("");
const text = z.string().trim();
const required = text.min(1, "Required");

export const enquirySchema = z.object({
  PropertyID: text.default(""),
  PropertyTitle: text.default(""),
  PropertyURL: text.default(""),
  Name: required,
  Phone: phone,
  Email: email,
  Message: text.max(2000).default(""),
  Source: text.default("Website"),
  UTMCampaign: text.default("")
});

export const enquiryUpdateSchema = z.object({
  EnquiryID: required,
  Status: z.enum(LEAD_STATUSES),
  AssignedTo: text.default(""),
  NextFollowUp: text.default(""),
  Notes: text.default("")
});

export const siteVisitSchema = z.object({
  PropertyID: required,
  PropertyTitle: text.default(""),
  Name: required,
  Phone: phone,
  Email: email,
  PreferredDate: required,
  PreferredTime: required
});

export const siteVisitUpdateSchema = z.object({
  VisitID: required,
  Status: z.enum(VISIT_STATUSES),
  AssignedTo: text.default(""),
  ActualVisitDate: text.default(""),
  Notes: text.default("")
});

export const requirementSchema = z.object({
  LookingTo: z.enum(PURPOSES),
  Category: z.enum(CATEGORIES),
  PropertyType: text.default(""),
  PreferredCity: required,
  PreferredLocality: text.default(""),
  MinimumBudget: text.default(""),
  MaximumBudget: text.default(""),
  Bedrooms: text.default(""),
  MinimumArea: text.default(""),
  AreaUnit: text.default("sq ft"),
  AdditionalRequirements: text.default(""),
  Name: required,
  Phone: phone,
  Email: email
});

export const requirementUpdateSchema = z.object({
  RequirementID: required,
  Status: z.enum(LEAD_STATUSES),
  AssignedTo: text.default(""),
  Notes: text.default("")
});

export const ownerLeadSchema = z.object({
  OwnerName: required,
  Phone: phone,
  Email: email,
  SellRent: z.enum(PURPOSES),
  Category: z.enum(CATEGORIES),
  PropertyType: text.default(""),
  City: required,
  Locality: required,
  Address: text.default(""),
  ExpectedPrice: text.default(""),
  PlotArea: text.default(""),
  BuiltupArea: text.default(""),
  AreaUnit: text.default("sq ft"),
  Description: text.default("")
});

export const ownerLeadUpdateSchema = z.object({
  OwnerLeadID: required,
  Status: z.enum(OWNER_STATUSES),
  AssignedTo: text.default(""),
  Notes: text.default("")
});
