export const SHEETS = {
  properties: "PROPERTIES",
  images: "PROPERTY_IMAGES",
  enquiries: "ENQUIRIES",
  visits: "SITE_VISITS",
  requirements: "REQUIREMENTS",
  ownerLeads: "OWNER_LEADS",
  locations: "LOCATIONS",
  categories: "CATEGORIES",
  amenities: "AMENITIES",
  settings: "SETTINGS"
} as const;

export const PROPERTY_HEADERS = [
  "PropertyID",
  "Title",
  "Slug",
  "Purpose",
  "Category",
  "PropertyType",
  "Price",
  "PriceDisplay",
  "Negotiable",
  "City",
  "Locality",
  "Address",
  "Latitude",
  "Longitude",
  "PlotArea",
  "BuiltupArea",
  "AreaUnit",
  "Bedrooms",
  "Bathrooms",
  "Balconies",
  "Floors",
  "FloorNumber",
  "Facing",
  "Furnishing",
  "Parking",
  "PropertyAge",
  "PossessionStatus",
  "OwnershipType",
  "Description",
  "Highlights",
  "Amenities",
  "Featured",
  "Verified",
  "Status",
  "MainImage",
  "VideoURL",
  "DateAdded",
  "DateUpdated",
  "SEO_Title",
  "SEO_Description",
  "Published",
  "CreatedBy",
  "AssignedAgent",
  "ContactPhone",
  "InternalNotes"
] as const;

export const IMAGE_HEADERS = ["ImageID", "PropertyID", "ImageURL", "ImageOrder", "AltText", "ImageType", "Active", "Notes"] as const;
export const ENQUIRY_HEADERS = ["EnquiryID", "DateTime", "PropertyID", "PropertyTitle", "CustomerName", "Phone", "Email", "Source", "Message", "Status", "AssignedTo", "NextFollowUp", "PropertyURL", "UTM_Campaign", "Notes"] as const;
export const VISIT_HEADERS = ["VisitID", "RequestedAt", "PropertyID", "PropertyTitle", "CustomerName", "Phone", "Email", "PreferredDate", "PreferredTime", "Status", "AssignedTo", "ConfirmedDate", "ConfirmedTime", "Outcome", "Source", "Notes"] as const;
export const REQUIREMENT_HEADERS = ["RequirementID", "DateTime", "CustomerName", "Phone", "Email", "LookingTo", "Category", "PropertyType", "PreferredCity", "PreferredLocality", "MinBudget", "MaxBudget", "Bedrooms", "MinArea", "AreaUnit", "AdditionalRequirements", "Status", "AssignedTo"] as const;
export const OWNER_HEADERS = ["OwnerLeadID", "DateTime", "OwnerName", "Phone", "Email", "Intent", "Category", "PropertyType", "City", "Locality", "Address", "ExpectedPrice", "PlotArea", "BuiltupArea", "AreaUnit", "Description", "ImageLinks", "Status", "AssignedTo", "Notes"] as const;
export const LOOKUP_HEADERS = ["ID", "Name", "Category", "City", "Locality", "Active", "DisplayOrder", "Notes"] as const;
export const SETTINGS_HEADERS = ["Key", "Value", "Notes"] as const;

export const PURPOSES = ["Sale", "Rent"] as const;
export const CATEGORIES = ["Residential", "Commercial", "Land"] as const;
export const PROPERTY_STATUSES = ["Available", "Under Negotiation", "Sold", "Rented", "Inactive"] as const;
export const PUBLISHED_VALUES = ["Yes", "No"] as const;
export const LEAD_STATUSES = ["New", "Contacted", "Follow Up", "Site Visit", "Negotiation", "Converted", "Lost"] as const;
export const VISIT_STATUSES = ["Requested", "Confirmed", "Completed", "Rescheduled", "Cancelled", "No Show"] as const;
export const OWNER_STATUSES = ["New", "Contacted", "Verification", "Approved", "Listed", "Rejected", "Closed"] as const;
