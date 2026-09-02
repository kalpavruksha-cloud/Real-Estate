import { z } from "zod";
import { CATEGORIES, PROPERTY_STATUSES, PUBLISHED_VALUES, PURPOSES } from "@/lib/constants";

const requiredText = z.string().trim().min(1, "Required");
const optionalText = z.string().trim().optional().default("");
const rupee = z.coerce.number().min(0, "Price must be zero or greater");

export const propertySchema = z.object({
  PropertyID: z.string().trim().optional().default(""),
  Title: requiredText,
  Slug: z.string().trim().optional().default(""),
  Purpose: z.enum(PURPOSES),
  Category: z.enum(CATEGORIES),
  PropertyType: requiredText,
  Price: rupee,
  PriceDisplay: optionalText,
  Negotiable: z.enum(PUBLISHED_VALUES).default("No"),
  City: requiredText,
  Locality: requiredText,
  Address: optionalText,
  Latitude: optionalText,
  Longitude: optionalText,
  PlotArea: optionalText,
  BuiltupArea: optionalText,
  AreaUnit: optionalText,
  Bedrooms: optionalText,
  Bathrooms: optionalText,
  Balconies: optionalText,
  Floors: optionalText,
  FloorNumber: optionalText,
  Facing: optionalText,
  Furnishing: optionalText,
  Parking: optionalText,
  PropertyAge: optionalText,
  PossessionStatus: optionalText,
  OwnershipType: optionalText,
  Description: requiredText,
  Highlights: optionalText,
  Amenities: optionalText,
  Featured: z.enum(PUBLISHED_VALUES).default("No"),
  Verified: z.enum(PUBLISHED_VALUES).default("No"),
  Status: z.enum(PROPERTY_STATUSES).default("Available"),
  MainImage: z.string().url().or(z.literal("")).default(""),
  VideoURL: z.string().url().or(z.literal("")).default(""),
  DateAdded: optionalText,
  DateUpdated: optionalText,
  SEO_Title: optionalText,
  SEO_Description: optionalText,
  Published: z.enum(PUBLISHED_VALUES).default("No"),
  CreatedBy: optionalText,
  AssignedAgent: optionalText,
  ContactPhone: optionalText,
  InternalNotes: optionalText
});

export const propertyPatchSchema = propertySchema.partial().extend({
  PropertyID: requiredText
});

export const propertyImportRowSchema = propertySchema.partial({
  Description: true,
  Locality: true,
  City: true,
  PropertyType: true,
  Title: true
});
