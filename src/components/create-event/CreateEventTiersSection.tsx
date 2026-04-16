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
  onAddTier: () => void;
  onRemoveTier: (tierId: string) => void;
  onTierNameChange: (tierId: string, value: string) => void;
  onTierPriceChange: (tierId: string, value: string) => void;
  onTierBenefitsChange: (tierId: string, value: string) => void;
};

export default function CreateEventTiersSection({
  tiers,
  loading,
  addTierDisabled,
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
            Define the packages sponsors can choose from.
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

      <div className="create-tier-list">
        {tiers.map((tier, index) => (
          <article key={tier.id} className="create-tier-card">
            <div className="create-tier-card-head">
              <h3 className="create-tier-title">Tier {index + 1}</h3>
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
        ))}
      </div>
    </div>
  );
}
