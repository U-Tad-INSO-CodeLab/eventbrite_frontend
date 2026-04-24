import type { Dispatch, SetStateAction } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slider,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupsIcon from '@mui/icons-material/Groups';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { PREDEFINED_TAGS } from '@/creators/lib/eventTags';
import {
  defaultSponsorDiscoverAdvancedFilters,
  SPONSOR_AUDIENCE_SLIDER_CAP,
  SPONSOR_BUDGET_SLIDER_CAP,
  type SponsorDiscoverAdvancedFilters,
} from '@/sponsors/lib/sponsorDiscoverFilters';
import '@/sponsors/components/SponsorDiscoverAdvancedFiltersDialog.css';

type SponsorDiscoverAdvancedFiltersDialogProps = {
  open: boolean;
  onClose: () => void;
  draft: SponsorDiscoverAdvancedFilters;
  onDraftChange: Dispatch<SetStateAction<SponsorDiscoverAdvancedFilters>>;
  onApply: () => void;
  locationOptions: string[];
};

export default function SponsorDiscoverAdvancedFiltersDialog({
  open,
  onClose,
  draft,
  onDraftChange,
  onApply,
  locationOptions,
}: SponsorDiscoverAdvancedFiltersDialogProps) {
  const setDraft = onDraftChange;

  const toggleTag = (tag: string) => {
    setDraft((d) => {
      const next = new Set(d.selectedTags);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return { ...d, selectedTags: Array.from(next) };
    });
  };

  const handleApply = () => {
    onApply();
    onClose();
  };

  const resetDraft = () => {
    setDraft(defaultSponsorDiscoverAdvancedFilters());
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="sponsor-adv-dialog"
      slotProps={{
        paper: { className: 'sponsor-adv-dialog-paper' },
      }}
      aria-labelledby="sponsor-adv-dialog-title"
    >
      <DialogTitle id="sponsor-adv-dialog-title" className="sponsor-adv-dialog-title">
        <Typography component="span" className="sponsor-adv-dialog-heading">
          Advanced Filters
        </Typography>
        <IconButton
          type="button"
          size="small"
          onClick={onClose}
          aria-label="Close advanced filters"
          className="sponsor-adv-dialog-close"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent className="sponsor-adv-dialog-body">
        <Box component="section" className="sponsor-adv-section">
          <Box className="sponsor-adv-section-head">
            <AttachMoneyIcon className="sponsor-adv-section-icon" aria-hidden />
            <Typography component="h2" className="sponsor-adv-section-title">
              Sponsorship budget
            </Typography>
          </Box>
          <Slider
            className="sponsor-adv-slider"
            value={draft.budgetRange}
            onChange={(_, v) =>
              setDraft((d) => ({ ...d, budgetRange: v as [number, number] }))
            }
            valueLabelDisplay="auto"
            min={0}
            max={SPONSOR_BUDGET_SLIDER_CAP}
            step={1000}
            valueLabelFormat={(v) =>
              v >= SPONSOR_BUDGET_SLIDER_CAP ? '200k+' : `$${v.toLocaleString()}`
            }
            getAriaLabel={() => 'Sponsorship budget range'}
          />
          <Box className="sponsor-adv-slider-labels">
            <span>$0</span>
            <span>$200,000+</span>
          </Box>
        </Box>

        <Box component="section" className="sponsor-adv-section">
          <Box className="sponsor-adv-section-head">
            <GroupsIcon className="sponsor-adv-section-icon" aria-hidden />
            <Typography component="h2" className="sponsor-adv-section-title">
              Audience size
            </Typography>
          </Box>
          <Slider
            className="sponsor-adv-slider"
            value={draft.audienceRange}
            onChange={(_, v) =>
              setDraft((d) => ({ ...d, audienceRange: v as [number, number] }))
            }
            valueLabelDisplay="auto"
            min={0}
            max={SPONSOR_AUDIENCE_SLIDER_CAP}
            step={100}
            valueLabelFormat={(v) =>
              v >= SPONSOR_AUDIENCE_SLIDER_CAP ? '10k+' : v.toLocaleString()
            }
            getAriaLabel={() => 'Expected audience range'}
          />
          <Box className="sponsor-adv-slider-labels">
            <span>0</span>
            <span>10,000+</span>
          </Box>
        </Box>

        <Box component="section" className="sponsor-adv-section">
          <Box className="sponsor-adv-section-head">
            <LocationOnIcon className="sponsor-adv-section-icon" aria-hidden />
            <Typography component="h2" className="sponsor-adv-section-title">
              Location
            </Typography>
          </Box>
          <Box className="sponsor-adv-chips" role="group" aria-label="Location">
            {locationOptions.map((loc) => {
              const selected = draft.location === loc;
              return (
                <button
                  key={loc || 'empty'}
                  type="button"
                  className={
                    selected ? 'sponsor-adv-chip sponsor-adv-chip--active' : 'sponsor-adv-chip'
                  }
                  onClick={() => setDraft((d) => ({ ...d, location: loc }))}
                >
                  {loc}
                </button>
              );
            })}
          </Box>
        </Box>

        <Box component="section" className="sponsor-adv-section">
          <Box className="sponsor-adv-section-head">
            <LocalOfferIcon className="sponsor-adv-section-icon" aria-hidden />
            <Typography component="h2" className="sponsor-adv-section-title">
              Tags
            </Typography>
          </Box>
          <Box
            className="sponsor-adv-chips sponsor-adv-chips--tags-scroll"
            role="group"
            aria-label="Tags. Select several; events that include at least one selected tag are shown."
          >
            {PREDEFINED_TAGS.map((tag) => {
              const selected = draft.selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  className={
                    selected ? 'sponsor-adv-chip sponsor-adv-chip--active' : 'sponsor-adv-chip'
                  }
                  aria-pressed={selected}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              );
            })}
          </Box>
        </Box>

        <Box className="sponsor-adv-actions">
          <Button
            type="button"
            variant="text"
            className="sponsor-adv-reset"
            onClick={resetDraft}
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="contained"
            disableElevation
            className="sponsor-adv-apply"
            onClick={handleApply}
          >
            Apply filters
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
