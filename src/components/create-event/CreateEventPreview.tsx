import { formatIsoDate } from '../../lib/formatIsoDate';

type Props = {
  coverImageDataUrl: string | null;
  title: string;
  description: string;
  date: string;
  location: string;
  expectedAttendance: string;
  previewTags: string[];
};

export default function CreateEventPreview({
  coverImageDataUrl,
  title,
  description,
  date,
  location,
  expectedAttendance,
  previewTags,
}: Props) {
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
        </div>
      </div>
    </aside>
  );
}
