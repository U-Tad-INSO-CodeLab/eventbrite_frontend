import type { MockEvent } from '@/events/lib/mockEvents';

/** Right end of slider = no upper cap (label shows "10,000+"). */
export const SPONSOR_AUDIENCE_SLIDER_CAP = 10_000;

/** Right end of slider = no upper cap (label shows max USD). */
export const SPONSOR_BUDGET_SLIDER_CAP = 200_000;

export type SponsorDiscoverAdvancedFilters = {
  budgetRange: [number, number];
  audienceRange: [number, number];
  location: string;
  /** Subset of `PREDEFINED_TAGS`; OR match against `event.tags`. */
  selectedTags: string[];
};

export function defaultSponsorDiscoverAdvancedFilters(): SponsorDiscoverAdvancedFilters {
  return {
    budgetRange: [0, SPONSOR_BUDGET_SLIDER_CAP],
    audienceRange: [0, SPONSOR_AUDIENCE_SLIDER_CAP],
    location: 'All',
    selectedTags: [],
  };
}

export function cloneSponsorDiscoverAdvancedFilters(
  f: SponsorDiscoverAdvancedFilters
): SponsorDiscoverAdvancedFilters {
  return {
    budgetRange: [...f.budgetRange] as [number, number],
    audienceRange: [...f.audienceRange] as [number, number],
    location: f.location,
    selectedTags: [...f.selectedTags],
  };
}

export const SPONSOR_DISCOVER_INDUSTRIES = [
  'All',
  'Technology',
  'Finance',
  'Energy & Sustainability',
  'Health & Wellness',
  'Media & Entertainment',
] as const;

export type SponsorDiscoverIndustry = (typeof SPONSOR_DISCOVER_INDUSTRIES)[number];

function eventHasSponsorshipTiers(e: MockEvent): boolean {
  if (e.sponsorshipTierCount > 0) return true;
  return Array.isArray(e.sponsorshipTiers) && e.sponsorshipTiers.length > 0;
}

export function filterDiscoverEvents(
  events: MockEvent[],
  query: string,
  industry: SponsorDiscoverIndustry,
  advanced: SponsorDiscoverAdvancedFilters
): MockEvent[] {
  const q = query.trim().toLowerCase();
  const [bMin, bMax] = advanced.budgetRange;
  const [aMin, aMax] = advanced.audienceRange;

  return events.filter((e) => {
    if (q && !e.title.toLowerCase().includes(q)) return false;
    if (industry !== 'All' && e.industry !== industry) return false;

    if (eventHasSponsorshipTiers(e)) {
      const price = e.sponsorshipMaxPriceUsd;
      if (price < bMin) return false;
      if (bMax < SPONSOR_BUDGET_SLIDER_CAP && price > bMax) return false;
    }

    const att = e.expectedAttendance;
    if (att < aMin) return false;
    if (aMax < SPONSOR_AUDIENCE_SLIDER_CAP && att > aMax) return false;

    if (advanced.location !== 'All' && e.location.trim() !== advanced.location) return false;

    if (advanced.selectedTags.length > 0) {
      const anyTag = advanced.selectedTags.some((t) => e.tags.includes(t));
      if (!anyTag) return false;
    }

    return true;
  });
}

export function discoverLocationOptions(events: MockEvent[]): string[] {
  const set = new Set(
    events.map((e) => e.location.trim()).filter(Boolean)
  );
  return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
}
