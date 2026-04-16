import { formatIsoDate } from '@/shared/lib/formatIsoDate';

type Props = {
  coverImageDataUrl: string | null;
  title: string;
  description: string;
  date: string;
  location: string;
  expectedAttendance: string;
  previewTags: string[];
  tiers: Array<{
    id: string;
    name: string;
    priceUsd: string;
    benefits: string;
  }>;
};

export default function CreateEventPreview({
  coverImageDataUrl,
  title,
  description,
  date,
  location,
  expectedAttendance,
  previewTags,
  tiers,
}: Props) {
  const previewTiers = tiers
    .map((tier) => {
      const name = tier.name.trim();
      if (!name) return null;
      const benefits = tier.benefits
        .split(',')
        .map((benefit) => benefit.trim())
        .filter(Boolean);
      const price = Number(tier.priceUsd);
      return {
        id: tier.id,
        name,
        benefits,
        price: Number.isFinite(price) && price > 0 ? Math.floor(price) : 0,
      };
    })
    .filter((tier): tier is { id: string; name: string; benefits: string[]; price: number } =>
      Boolean(tier)
    );

  return (
    <aside className="create-preview" aria-label="Live preview">
      <h2 className="create-preview-heading">
        <span className="create-preview-eye" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
          </svg>
        </span>
        Live Preview
      </h2>
      <div className="create-preview-card">
        <div className="create-preview-media">
          {coverImageDataUrl ? (
            <img src={coverImageDataUrl} alt="" />
          ) : (
            <div className="placeholder">Cover Image</div>
          )}
        </div>
        <div className="create-preview-content">
          <strong>{title.trim() || 'e.g. TechConnect Summit 2026'}</strong>
          <p>{description.trim() || 'Event description will appear here...'}</p>
          <ul className="create-preview-meta-list">
            <li>
              <span
                className="material-symbols-outlined create-preview-meta-icon"
                aria-hidden="true"
              >
                calendar_today
              </span>
              {date ? formatIsoDate(date) : 'dd/mm/yyyy'}
            </li>
            <li>
              <span
                className="material-symbols-outlined create-preview-meta-icon"
                aria-hidden="true"
              >
                location_on
              </span>
              {location.trim() || 'City, State'}
            </li>
            <li>
              <span
                className="material-symbols-outlined create-preview-meta-icon"
                aria-hidden="true"
              >
                groups
              </span>
              {expectedAttendance.trim() || '0'}
            </li>
          </ul>
          <div className="create-preview-tags">
            {(previewTags.length > 0 ? previewTags : ['AI', 'SaaS', 'Networking']).map(
              (tag) => (
                <span key={tag}>{tag}</span>
              )
            )}
          </div>
          {previewTiers.length > 0 ? (
            <section className="create-preview-tiers">
              <h4>Sponsorship Tiers</h4>
              <ul>
                {previewTiers.map((tier) => (
                  <li key={tier.id}>
                    <div className="create-preview-tier-top">
                      <strong>{tier.name}</strong>
                      <span>${tier.price.toLocaleString()}</span>
                    </div>
                    {tier.benefits.length > 0 ? (
                      <p>{tier.benefits.join(' · ')}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
