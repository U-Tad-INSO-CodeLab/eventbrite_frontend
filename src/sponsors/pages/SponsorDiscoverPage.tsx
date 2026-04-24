import { useMemo, useState } from 'react';
import { Box, Button, InputBase, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SponsorDiscoverCard from '@/sponsors/components/SponsorDiscoverCard';
import SponsorDiscoverAdvancedFiltersDialog from '@/sponsors/components/SponsorDiscoverAdvancedFiltersDialog';
import { getMockSession } from '@/auth/lib/mockAuth';
import { getDiscoverMockEvents } from '@/events/lib/mockEvents';
import {
  cloneSponsorDiscoverAdvancedFilters,
  defaultSponsorDiscoverAdvancedFilters,
  discoverLocationOptions,
  filterDiscoverEvents,
  SPONSOR_DISCOVER_INDUSTRIES,
  type SponsorDiscoverAdvancedFilters,
  type SponsorDiscoverIndustry,
} from '@/sponsors/lib/sponsorDiscoverFilters';
import '@/sponsors/pages/SponsorDiscoverPage.css';

export default function SponsorDiscoverPage() {
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState<SponsorDiscoverIndustry>('All');
  const [advancedFilters, setAdvancedFilters] = useState<SponsorDiscoverAdvancedFilters>(() =>
    defaultSponsorDiscoverAdvancedFilters()
  );
  const [filterDraft, setFilterDraft] = useState<SponsorDiscoverAdvancedFilters>(() =>
    defaultSponsorDiscoverAdvancedFilters()
  );
  const [filtersOpen, setFiltersOpen] = useState(false);

  const session = getMockSession();
  if (!session || session.role !== 'sponsor') return null;

  const events = getDiscoverMockEvents();
  const locationOptions = useMemo(() => discoverLocationOptions(events), [events]);

  const filteredEvents = useMemo(
    () => filterDiscoverEvents(events, search, industry, advancedFilters),
    [events, search, industry, advancedFilters]
  );

  return (
    <Box className="discover-page">
      <Box component="header" className="discover-header">
        <Typography component="h1">Discover Events</Typography>
        <Typography component="p" className="discover-subtitle">
          Find the perfect sponsorship opportunity for your brand.
        </Typography>
        <Box className="discover-toolbar">
          <Box component="label" className="discover-search">
            <SearchIcon className="discover-search-icon" aria-hidden="true" />
            <InputBase
              type="search"
              className="discover-search-input-root"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              inputProps={{
                className: 'discover-search-input',
                'aria-label': 'Search events by name',
                autoComplete: 'off',
              }}
            />
          </Box>
          <Button
            type="button"
            variant="contained"
            disableElevation
            className="discover-filters-btn"
            startIcon={<FilterListIcon />}
            onClick={() => {
              setFilterDraft(cloneSponsorDiscoverAdvancedFilters(advancedFilters));
              setFiltersOpen(true);
            }}
            aria-haspopup="dialog"
            aria-expanded={filtersOpen}
          >
            Filters
          </Button>
        </Box>
        <Box
          className="discover-category-chips"
          role="tablist"
          aria-label="Filter by industry"
        >
          {SPONSOR_DISCOVER_INDUSTRIES.map((key) => {
            const selected = industry === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={selected}
                className={
                  selected
                    ? 'discover-category-chip discover-category-chip--active'
                    : 'discover-category-chip'
                }
                onClick={() => setIndustry(key)}
              >
                {key}
              </button>
            );
          })}
        </Box>
      </Box>

      <SponsorDiscoverAdvancedFiltersDialog
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        draft={filterDraft}
        onDraftChange={setFilterDraft}
        onApply={() => setAdvancedFilters(cloneSponsorDiscoverAdvancedFilters(filterDraft))}
        locationOptions={locationOptions}
      />

      {events.length === 0 ? (
        <Typography component="p" className="discover-empty">
          No events to show yet.
        </Typography>
      ) : filteredEvents.length === 0 ? (
        <Typography component="p" className="discover-empty">
          No events match your filters. Try broadening search or filters.
        </Typography>
      ) : (
        <Box className="discover-grid">
          {filteredEvents.map((event) => (
            <SponsorDiscoverCard key={event.id} event={event} />
          ))}
        </Box>
      )}
    </Box>
  );
}
