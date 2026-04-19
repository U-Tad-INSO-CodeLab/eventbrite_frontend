import { useNavigate } from 'react-router-dom';
import { formatIsoDate } from '@/shared/lib/formatIsoDate';
import { formatUsdCompact } from '@/shared/lib/formatUsdCompact';
import type { MockEvent } from '@/events/lib/mockEvents';
import { organizerInitials } from '@/shared/lib/organizerInitials';
import { getMockSession } from '@/auth/lib/mockAuth';
import { ensureDealThreadForSponsorEvent } from '@/chat/lib/mockDealThreads';

type SponsorDiscoverCardProps = {
  event: MockEvent;
};

export default function SponsorDiscoverCard({ event }: SponsorDiscoverCardProps) {
  const navigate = useNavigate();
  const tierCount = Array.isArray(event.sponsorshipTiers)
    ? event.sponsorshipTiers.length
    : event.sponsorshipTierCount;
  const maxTierPrice = Array.isArray(event.sponsorshipTiers)
    ? event.sponsorshipTiers.reduce(
      (maxPrice, tier) => Math.max(maxPrice, tier.priceUsd),
      0
    )
    : event.sponsorshipMaxPriceUsd;

  return (
    <article className="discover-card">
      <div className="discover-card-media">
        <img src={event.coverImageDataUrl} alt="" loading="lazy" />
        <span className="discover-card-category">{event.industry || 'Event'}</span>
      </div>
      <div className="discover-card-body">
        <h3 className="discover-card-title">{event.title}</h3>
        <p className="discover-card-desc">{event.description}</p>
        <ul className="discover-card-meta">
          <li>
            <span className="material-symbols-outlined" aria-hidden="true">
              calendar_today
            </span>
            {formatIsoDate(event.date, '—')}
          </li>
          <li>
            <span className="material-symbols-outlined" aria-hidden="true">
              location_on
            </span>
            {event.location.trim() || '—'}
          </li>
          <li>
            <span className="material-symbols-outlined" aria-hidden="true">
              groups
            </span>
            {event.expectedAttendance > 0
              ? event.expectedAttendance.toLocaleString()
              : '—'}
          </li>
        </ul>
        {event.tags.length > 0 ? (
          <div className="discover-card-tags discover-card-tags--chips">
            {event.tags.map((tag) => (
              <span key={tag} className="discover-card-tag-chip">
                <span className="material-symbols-outlined" aria-hidden="true">
                  local_offer
                </span>
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        {tierCount > 0 ? (
          <div className="discover-card-tier-summary">
            <span>
              <strong>{tierCount}</strong> tier{tierCount === 1 ? '' : 's'}
            </span>
            <span>·</span>
            <span>
              up to{' '}
              <strong className="discover-card-tier-price">
                {formatUsdCompact(maxTierPrice)}
              </strong>
            </span>
          </div>
        ) : (
          <div className="discover-card-tier-summary discover-card-tier-summary--empty">
            No sponsorship tiers yet
          </div>
        )}
      </div>
      <footer className="discover-card-footer">
        <div className="discover-card-organizer">
          <span className="discover-card-avatar" aria-hidden="true">
            {organizerInitials(event.creatorName)}
          </span>
          <span className="discover-card-organizer-name">{event.creatorName}</span>
        </div>
        <button
          type="button"
          className="discover-card-cta"
          onClick={() => {
            const session = getMockSession();
            if (!session || session.role !== 'sponsor') return;
            const thread = ensureDealThreadForSponsorEvent(session, event);
            navigate(`/sponsor/messages?thread=${encodeURIComponent(thread.id)}`);
          }}
        >
          Sponsor Now
        </button>
      </footer>
    </article>
  );
}
