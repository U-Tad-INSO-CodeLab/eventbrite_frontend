import EventDatePicker from '@/events/components/EventDatePicker';
import CreateEventTiersSection from '@/creators/components/create-event/CreateEventTiersSection';
import type { CreatorTierTemplate } from '@/creators/lib/creatorTierTemplates';
import type { ChangeEventHandler, DragEventHandler, MouseEventHandler, RefObject, FormEventHandler } from 'react';

type Props = {
  title: string;
  description: string;
  date: string;
  location: string;
  industry: string;
  expectedAttendance: string;
  tags: string;
  tiers: Array<{
    id: string;
    name: string;
    priceUsd: string;
    benefits: string;
  }>;
  coverImageDataUrl: string | null;
  coverDragging: boolean;
  coverInputRef: RefObject<HTMLInputElement | null>;
  error: string;
  success: string;
  loading: boolean;
  onTitleChange: ChangeEventHandler<HTMLInputElement>;
  onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  onDateChange: (value: string) => void;
  onLocationChange: ChangeEventHandler<HTMLInputElement>;
  onIndustryChange: ChangeEventHandler<HTMLInputElement>;
  onExpectedAttendanceChange: ChangeEventHandler<HTMLInputElement>;
  onTagsChange: ChangeEventHandler<HTMLInputElement>;
  onTierNameChange: (tierId: string, value: string) => void;
  onTierPriceChange: (tierId: string, value: string) => void;
  onTierBenefitsChange: (tierId: string, value: string) => void;
  savedTemplates: CreatorTierTemplate[];
  isTierAlreadySaved: (tierId: string) => boolean;
  onApplySavedTemplate: (template: CreatorTierTemplate) => void;
  onSaveTierAsTemplate: (tierId: string) => void;
  onAddTier: () => void;
  addTierDisabled: boolean;
  onRemoveTier: (tierId: string) => void;
  onCoverUpload: ChangeEventHandler<HTMLInputElement>;
  onCoverDragEnter: DragEventHandler<HTMLLabelElement>;
  onCoverDragOver: DragEventHandler<HTMLLabelElement>;
  onCoverDragLeave: DragEventHandler<HTMLLabelElement>;
  onCoverDrop: DragEventHandler<HTMLLabelElement>;
  onClearCover: MouseEventHandler<HTMLButtonElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export default function CreateEventForm({
  title,
  description,
  date,
  location,
  industry,
  expectedAttendance,
  tags,
  tiers,
  coverImageDataUrl,
  coverDragging,
  coverInputRef,
  error,
  success,
  loading,
  onTitleChange,
  onDescriptionChange,
  onDateChange,
  onLocationChange,
  onIndustryChange,
  onExpectedAttendanceChange,
  onTagsChange,
  onTierNameChange,
  onTierPriceChange,
  onTierBenefitsChange,
  savedTemplates,
  isTierAlreadySaved,
  onApplySavedTemplate,
  onSaveTierAsTemplate,
  onAddTier,
  addTierDisabled,
  onRemoveTier,
  onCoverUpload,
  onCoverDragEnter,
  onCoverDragOver,
  onCoverDragLeave,
  onCoverDrop,
  onClearCover,
  onSubmit,
}: Props) {
  return (
    <main className="create-layout">
      <section>
        <h1>Create Event</h1>
        <p>Set up your event and attract sponsors.</p>

        {error ? <div className="create-alert create-alert-error">{error}</div> : null}
        {success ? (
          <div className="create-alert create-alert-success">{success}</div>
        ) : null}

        <form className="create-form" onSubmit={onSubmit}>
          <div className="create-field">
            <span className="create-field-label" id="create-cover-label">
              Cover Image
            </span>
            <label
              className={`create-upload${coverDragging ? ' is-dragging' : ''}`}
              htmlFor="create-cover-input"
              aria-labelledby="create-cover-label"
              onDragEnter={onCoverDragEnter}
              onDragOver={onCoverDragOver}
              onDragLeave={onCoverDragLeave}
              onDrop={onCoverDrop}
            >
              <input
                ref={coverInputRef}
                id="create-cover-input"
                type="file"
                accept="image/*"
                onChange={onCoverUpload}
                hidden
              />
              {coverImageDataUrl ? (
                <div className="create-upload-preview">
                  <img src={coverImageDataUrl} alt="Cover preview" />
                  <button
                    type="button"
                    className="create-upload-clear"
                    onClick={onClearCover}
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
              onChange={onTitleChange}
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
              onChange={onDescriptionChange}
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
                onChange={onDateChange}
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
                onChange={onLocationChange}
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
                onChange={onIndustryChange}
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
                onChange={onExpectedAttendanceChange}
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
              onChange={onTagsChange}
              disabled={loading}
            />
          </div>

          <CreateEventTiersSection
            tiers={tiers}
            loading={loading}
            addTierDisabled={addTierDisabled}
            savedTemplates={savedTemplates}
            isTierAlreadySaved={isTierAlreadySaved}
            onApplySavedTemplate={onApplySavedTemplate}
            onSaveTierAsTemplate={onSaveTierAsTemplate}
            onAddTier={onAddTier}
            onRemoveTier={onRemoveTier}
            onTierNameChange={onTierNameChange}
            onTierPriceChange={onTierPriceChange}
            onTierBenefitsChange={onTierBenefitsChange}
          />

          <button type="submit" className="create-submit" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Event'}
          </button>
        </form>
      </section>
    </main>
  );
}
