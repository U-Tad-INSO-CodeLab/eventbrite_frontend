import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type MouseEvent,
  type SubmitEventHandler,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { getMockSession } from '../lib/mockAuth';
import { createMockEvent } from '../lib/mockEvents';
import { formatIsoDate } from '../lib/formatIsoDate';
import EventDatePicker from '../components/EventDatePicker';
import './createEvent.css';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });
}

export default function CreateEventPage() {
  const navigate = useNavigate();
  const session = getMockSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [expectedAttendance, setExpectedAttendance] = useState('');
  const [tags, setTags] = useState('');
  const [coverImageDataUrl, setCoverImageDataUrl] = useState<string | null>(null);
  const [coverDragging, setCoverDragging] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const previewTags = useMemo(
    () =>
      tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 3),
    [tags]
  );

  if (!session || session.role !== 'creator') return null;

  const processCoverFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please drop an image file (PNG, JPG, etc.).');
      return;
    }
    void (async () => {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setCoverImageDataUrl(dataUrl);
        setError('');
      } catch {
        setError('Could not read the cover image.');
      }
    })();
  };

  const handleCoverUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processCoverFile(file);
    event.target.value = '';
  };

  const handleCoverDragEnter = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setCoverDragging(true);
  };

  const handleCoverDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  };

  const handleCoverDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setCoverDragging(false);
    }
  };

  const handleCoverDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setCoverDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    processCoverFile(file);
  };

  const handleClearCover = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setCoverImageDataUrl(null);
    const input = coverInputRef.current;
    if (input) input.value = '';
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Indica el título del evento.');
      return;
    }
    if (!description.trim()) {
      setError('Indica la descripción del evento.');
      return;
    }
    setLoading(true);
    void (async () => {
      const result = await createMockEvent(session, {
        title,
        description,
        date,
        location,
        industry,
        expectedAttendance: Number(expectedAttendance) || 0,
        tags: tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        coverImageDataUrl,
      });
      setLoading(false);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setSuccess('Evento publicado en mock correctamente.');
      setTimeout(() => navigate('/creator'), 500);
    })();
  };

  return (
    <div className="create-body">
      <main className="create-layout">
        <section>
          <h1>Create Event</h1>
          <p>Set up your event and attract sponsors.</p>

          {error ? <div className="create-alert create-alert-error">{error}</div> : null}
          {success ? <div className="create-alert create-alert-success">{success}</div> : null}

          <form className="create-form" onSubmit={handleSubmit}>
            <div className="create-field">
              <span className="create-field-label" id="create-cover-label">
                Cover Image
              </span>
              <label
                className={`create-upload${coverDragging ? ' is-dragging' : ''}`}
                htmlFor="create-cover-input"
                aria-labelledby="create-cover-label"
                onDragEnter={handleCoverDragEnter}
                onDragOver={handleCoverDragOver}
                onDragLeave={handleCoverDragLeave}
                onDrop={handleCoverDrop}
              >
                <input
                  ref={coverInputRef}
                  id="create-cover-input"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  hidden
                />
                {coverImageDataUrl ? (
                  <div className="create-upload-preview">
                    <img src={coverImageDataUrl} alt="Cover preview" />
                    <button
                      type="button"
                      className="create-upload-clear"
                      onClick={handleClearCover}
                      disabled={loading}
                      aria-label="Remove cover image"
                    >
                      <span className="material-symbols-outlined" aria-hidden="true">
                        close
                      </span>
                    </button>
                  </div>
                ) : (
                  <span>Click to upload or drag and drop a cover image</span>
                )}
              </label>
            </div>

            <div className="create-field">
              <label className="create-field-label" htmlFor="create-title">
                Event Title
              </label>
              <input
                id="create-title"
                name="title"
                type="text"
                autoComplete="off"
                placeholder="e.g. TechConnect Summit 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="create-field">
              <label className="create-field-label" htmlFor="create-description">
                Description
              </label>
              <textarea
                id="create-description"
                name="description"
                placeholder="Describe your event..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="create-grid">
              <div className="create-field">
                <label className="create-field-label" htmlFor="create-date">
                  Date
                </label>
                <EventDatePicker
                  id="create-date"
                  value={date}
                  onChange={setDate}
                  disabled={loading}
                />
              </div>
              <div className="create-field">
                <label className="create-field-label" htmlFor="create-location">
                  Location
                </label>
                <input
                  id="create-location"
                  name="location"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="City, State"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="create-field">
                <label className="create-field-label" htmlFor="create-industry">
                  Industry
                </label>
                <input
                  id="create-industry"
                  name="industry"
                  type="text"
                  placeholder="e.g. Technology"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="create-field">
                <label className="create-field-label" htmlFor="create-attendance">
                  Expected Attendance
                </label>
                <input
                  id="create-attendance"
                  name="expectedAttendance"
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 5000"
                  value={expectedAttendance}
                  onChange={(e) => setExpectedAttendance(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="create-field">
              <label className="create-field-label" htmlFor="create-tags">
                Tags (comma-separated)
              </label>
              <input
                id="create-tags"
                name="tags"
                type="text"
                placeholder="AI, SaaS, Networking"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                disabled={loading}
              />
            </div>

            <button type="submit" className="create-submit" disabled={loading}>
              {loading ? 'Publicando...' : 'Publish Event'}
            </button>
          </form>
        </section>
      </main>

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
    </div>
  );
}
