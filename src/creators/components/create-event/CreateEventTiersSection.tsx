import { Link } from 'react-router-dom';
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
    <div className="create-field">
      <div className="create-tier-head">
        <div>
          <label className="create-field-label">Sponsorship Tiers</label>
          <p className="create-tier-subtitle">
            Define the packages sponsors can choose from. Reuse your saved library or edit
            fields for this event only.
          </p>
        </div>
        <button
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
        </button>
      </div>

      <div className="create-tier-saved" aria-label="Saved tier templates">
        <p className="create-tier-saved-label">From your library</p>
        {savedTemplates.length === 0 ? (
          <p className="create-tier-saved-hint">
            No saved tiers yet.{' '}
            <Link to="/creator/tier-templates">Manage your tier library</Link> or fill rows
            below and use &quot;Save to library&quot; on a tier.
          </p>
        ) : (
          <div className="create-tier-saved-chips">
            {savedTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                className="create-tier-saved-chip"
                disabled={loading}
                onClick={() => onApplySavedTemplate(template)}
                title={`Add a copy of ${template.name} to this event`}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  bookmark_add
                </span>
                {template.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="create-tier-list">
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
            <article key={tier.id} className="create-tier-card">
              <div className="create-tier-card-head">
                <h3 className="create-tier-title">Tier {index + 1}</h3>
                <div className="create-tier-card-actions">
                  <button
                    type="button"
                    className="create-tier-save-lib-btn"
                    onClick={() => onSaveTierAsTemplate(tier.id)}
                    disabled={saveDisabled}
                    title={saveTitle}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">
                      bookmark
                    </span>
                    Save to library
                  </button>
                  <button
                    type="button"
                    className="create-tier-delete-btn"
                    onClick={() => onRemoveTier(tier.id)}
                    disabled={loading || tiers.length === 1}
                    aria-label={`Delete tier ${index + 1}`}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">
                      delete
                    </span>
                  </button>
                </div>
              </div>
              {tierAlreadySaved ? (
                <p className="create-tier-saved-note">Already saved in your library</p>
              ) : null}
              <div className="create-field">
                <label
                  className="create-field-label"
                  htmlFor={`create-tier-name-${tier.id}`}
                >
                  Tier Name
                </label>
                <input
                  id={`create-tier-name-${tier.id}`}
                  type="text"
                  placeholder="e.g. Platinum, Gold..."
                  value={tier.name}
                  onChange={(e) => onTierNameChange(tier.id, e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="create-field">
                <label
                  className="create-field-label"
                  htmlFor={`create-tier-price-${tier.id}`}
                >
                  Price ($)
                </label>
                <input
                  id={`create-tier-price-${tier.id}`}
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 50000"
                  value={tier.priceUsd}
                  onChange={(e) => onTierPriceChange(tier.id, e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="create-field">
                <label
                  className="create-field-label"
                  htmlFor={`create-tier-benefits-${tier.id}`}
                >
                  Benefits (comma-separated)
                </label>
                <input
                  id={`create-tier-benefits-${tier.id}`}
                  type="text"
                  placeholder="Keynote slot, Premium booth, Logo on materials..."
                  value={tier.benefits}
                  onChange={(e) => onTierBenefitsChange(tier.id, e.target.value)}
                  disabled={loading}
                />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
