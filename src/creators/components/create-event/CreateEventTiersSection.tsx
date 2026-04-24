import { Link } from 'react-router-dom';
import { Box, Button, InputBase, Typography } from '@mui/material';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteIcon from '@mui/icons-material/Delete';
import type { CreatorTierTemplate } from '@/creators/lib/creatorTierTemplates';

type TierDraft = {
  id: string;
  name: string;
  priceUsd: string;
  benefits: string;
};

type Props = {
  tiers: TierDraft[];
  loading: boolean;
  addTierDisabled: boolean;
  savedTemplates: CreatorTierTemplate[];
  isTierAlreadySaved: (tierId: string) => boolean;
  onApplySavedTemplate: (template: CreatorTierTemplate) => void;
  onSaveTierAsTemplate: (tierId: string) => void;
  onAddTier: () => void;
  onRemoveTier: (tierId: string) => void;
  onTierNameChange: (tierId: string, value: string) => void;
  onTierPriceChange: (tierId: string, value: string) => void;
  onTierBenefitsChange: (tierId: string, value: string) => void;
};

function tierRowComplete(tier: TierDraft): boolean {
  const hasName = tier.name.trim().length > 0;
  const price = Number(tier.priceUsd);
  const hasValidPrice = Number.isFinite(price) && price > 0;
  return hasName && hasValidPrice;
}

export default function CreateEventTiersSection({
  tiers,
  loading,
  addTierDisabled,
  savedTemplates,
  isTierAlreadySaved,
  onApplySavedTemplate,
  onSaveTierAsTemplate,
  onAddTier,
  onRemoveTier,
  onTierNameChange,
  onTierPriceChange,
  onTierBenefitsChange,
}: Props) {
  return (
    <Box className="create-field">
      <Box className="create-tier-head">
        <Box>
          <Typography component="label" className="create-field-label">
            Sponsorship Tiers
          </Typography>
          <Typography component="p" className="create-tier-subtitle">
            Define the packages sponsors can choose from. Reuse your saved library or edit
            fields for this event only.
          </Typography>
        </Box>
        <Button
          type="button"
          className="create-tier-add-btn"
          onClick={onAddTier}
          disabled={loading || addTierDisabled}
          title={
            addTierDisabled
              ? 'You have to complete tier name and price to create more.'
              : undefined
          }
        >
          + Add Tier
        </Button>
      </Box>

      <Box className="create-tier-saved" aria-label="Saved tier templates">
        <Typography component="p" className="create-tier-saved-label">
          From your library
        </Typography>
        {savedTemplates.length === 0 ? (
          <Typography component="p" className="create-tier-saved-hint">
            No saved tiers yet.{' '}
            <Link to="/creator/tier-templates">Manage your tier library</Link> or fill rows
            below and use &quot;Save to library&quot; on a tier.
          </Typography>
        ) : (
          <Box className="create-tier-saved-chips">
            {savedTemplates.map((template) => (
              <Button
                key={template.id}
                type="button"
                className="create-tier-saved-chip"
                disabled={loading}
                onClick={() => onApplySavedTemplate(template)}
                title={`Add a copy of ${template.name} to this event`}
              >
                <BookmarkAddIcon fontSize="inherit" />
                {template.name}
              </Button>
            ))}
          </Box>
        )}
      </Box>

      <Box className="create-tier-list">
        {tiers.map((tier, index) => {
          const tierComplete = tierRowComplete(tier);
          const tierAlreadySaved = isTierAlreadySaved(tier.id);
          const saveDisabled = loading || !tierComplete || tierAlreadySaved;
          const saveTitle = !tierComplete
            ? 'Enter name and price before saving to library'
            : tierAlreadySaved
              ? 'An identical tier already exists in your library'
              : 'Save this tier to your reusable library';

          return (
            <Box component="article" key={tier.id} className="create-tier-card">
              <Box className="create-tier-card-head">
                <Typography component="h3" className="create-tier-title">
                  Tier {index + 1}
                </Typography>
                <Box className="create-tier-card-actions">
                  <Button
                    type="button"
                    className="create-tier-save-lib-btn"
                    onClick={() => onSaveTierAsTemplate(tier.id)}
                    disabled={saveDisabled}
                    title={saveTitle}
                  >
                    <BookmarkIcon fontSize="inherit" />
                    Save to library
                  </Button>
                  <Button
                    type="button"
                    className="create-tier-delete-btn"
                    onClick={() => onRemoveTier(tier.id)}
                    disabled={loading || tiers.length === 1}
                    aria-label={`Delete tier ${index + 1}`}
                  >
                    <DeleteIcon fontSize="inherit" />
                  </Button>
                </Box>
              </Box>
              {tierAlreadySaved ? (
                <Typography component="p" className="create-tier-saved-note">
                  Already saved in your library
                </Typography>
              ) : null}
              <Box className="create-field">
                <Typography
                  component="label"
                  className="create-field-label"
                  htmlFor={`create-tier-name-${tier.id}`}
                >
                  Tier Name
                </Typography>
                <InputBase
                  id={`create-tier-name-${tier.id}`}
                  type="text"
                  placeholder="e.g. Platinum, Gold..."
                  value={tier.name}
                  onChange={(e) => onTierNameChange(tier.id, e.target.value)}
                  disabled={loading}
                />
              </Box>
              <Box className="create-field">
                <Typography
                  component="label"
                  className="create-field-label"
                  htmlFor={`create-tier-price-${tier.id}`}
                >
                  Price ($)
                </Typography>
                <InputBase
                  id={`create-tier-price-${tier.id}`}
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 50000"
                  value={tier.priceUsd}
                  onChange={(e) => onTierPriceChange(tier.id, e.target.value)}
                  disabled={loading}
                />
              </Box>
              <Box className="create-field">
                <Typography
                  component="label"
                  className="create-field-label"
                  htmlFor={`create-tier-benefits-${tier.id}`}
                >
                  Benefits (comma-separated)
                </Typography>
                <InputBase
                  id={`create-tier-benefits-${tier.id}`}
                  type="text"
                  placeholder="Keynote slot, Premium booth, Logo on materials..."
                  value={tier.benefits}
                  onChange={(e) => onTierBenefitsChange(tier.id, e.target.value)}
                  disabled={loading}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
