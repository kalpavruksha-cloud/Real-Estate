export type AnalyticsEvent =
  | "property_view"
  | "property_search"
  | "property_filter"
  | "whatsapp_click"
  | "call_click"
  | "enquiry_submit"
  | "site_visit_submit"
  | "requirement_submit"
  | "owner_listing_submit";

export function trackEvent(event: AnalyticsEvent, payload: Record<string, unknown> = {}) {
  try {
    if (typeof window !== "undefined" && "gtag" in window) {
      const gtag = (window as unknown as { gtag: (name: string, event: string, payload: Record<string, unknown>) => void }).gtag;
      gtag("event", event, payload);
    }
  } catch {
    // Analytics must never block business workflows.
  }
}
