export type Role = "SUPER_ADMIN" | "ADMIN" | "AGENT";
export type Purpose = "Sale" | "Rent";
export type Category = "Residential" | "Commercial" | "Land";
export type Published = "Yes" | "No";
export type PropertyStatus = "Available" | "Under Negotiation" | "Sold" | "Rented" | "Inactive";
export type LeadStatus =
  | "New"
  | "Contacted"
  | "Follow Up"
  | "Site Visit"
  | "Negotiation"
  | "Converted"
  | "Lost";
export type VisitStatus = "Requested" | "Confirmed" | "Completed" | "Rescheduled" | "Cancelled" | "No Show";
export type OwnerLeadStatus = "New" | "Contacted" | "Verification" | "Approved" | "Listed" | "Rejected" | "Closed";

export interface Property {
  PropertyID: string;
  Title: string;
  Slug: string;
  Purpose: Purpose;
  Category: Category;
  PropertyType: string;
  Price: number;
  PriceDisplay: string;
  Negotiable: Published;
  City: string;
  Locality: string;
  Address: string;
  Latitude: string;
  Longitude: string;
  PlotArea: string;
  BuiltupArea: string;
  AreaUnit: string;
  Bedrooms: string;
  Bathrooms: string;
  Balconies: string;
  Floors: string;
  FloorNumber: string;
  Facing: string;
  Furnishing: string;
  Parking: string;
  PropertyAge: string;
  PossessionStatus: string;
  OwnershipType: string;
  Description: string;
  Highlights: string;
  Amenities: string;
  Featured: Published;
  Verified: Published;
  Status: PropertyStatus;
  MainImage: string;
  VideoURL: string;
  DateAdded: string;
  DateUpdated: string;
  SEO_Title: string;
  SEO_Description: string;
  Published: Published;
  CreatedBy: string;
  AssignedAgent: string;
  ContactPhone: string;
  InternalNotes: string;
}

export interface PropertyImage {
  ImageID: string;
  PropertyID: string;
  ImageURL: string;
  ImageOrder: number;
  AltText: string;
  ImageType: "Main" | "Gallery";
  Active: Published;
  Notes: string;
}

export interface Enquiry {
  EnquiryID: string;
  DateTime: string;
  PropertyID: string;
  PropertyTitle: string;
  PropertyURL: string;
  Name: string;
  Phone: string;
  Email: string;
  Message: string;
  Source: string;
  UTMCampaign: string;
  Status: LeadStatus;
  AssignedTo: string;
  NextFollowUp: string;
  Notes: string;
}

export interface SiteVisit {
  VisitID: string;
  DateTime: string;
  PropertyID: string;
  PropertyTitle: string;
  Name: string;
  Phone: string;
  Email: string;
  PreferredDate: string;
  PreferredTime: string;
  Status: VisitStatus;
  AssignedTo: string;
  ActualVisitDate: string;
  Notes: string;
}

export interface Requirement {
  RequirementID: string;
  DateTime: string;
  LookingTo: Purpose;
  Category: Category;
  PropertyType: string;
  PreferredCity: string;
  PreferredLocality: string;
  MinimumBudget: string;
  MaximumBudget: string;
  Bedrooms: string;
  MinimumArea: string;
  AreaUnit: string;
  AdditionalRequirements: string;
  Name: string;
  Phone: string;
  Email: string;
  Status: LeadStatus;
  AssignedTo: string;
  Notes: string;
}

export interface OwnerLead {
  OwnerLeadID: string;
  DateTime: string;
  OwnerName: string;
  Phone: string;
  Email: string;
  SellRent: Purpose;
  Category: Category;
  PropertyType: string;
  City: string;
  Locality: string;
  Address: string;
  ExpectedPrice: string;
  PlotArea: string;
  BuiltupArea: string;
  AreaUnit: string;
  Description: string;
  ImageURLs: string;
  Status: OwnerLeadStatus;
  AssignedTo: string;
  Notes: string;
}

export interface LookupOption {
  ID: string;
  Name: string;
  Category?: string;
  City?: string;
  Locality?: string;
  Active: Published;
  DisplayOrder: string;
  Notes?: string;
}

export interface SiteSettings {
  BusinessName: string;
  Phone: string;
  WhatsApp: string;
  Email: string;
  Address: string;
  DefaultCity: string;
  LocationPrivacy: string;
  ShowSoldProperties: Published;
  ShowRentedProperties: Published;
  DefaultSEO_Title: string;
  DefaultSEO_Description: string;
  Instagram?: string;
  Facebook?: string;
  YouTube?: string;
}

export interface PublicProperty extends Property {
  Images: PropertyImage[];
}

