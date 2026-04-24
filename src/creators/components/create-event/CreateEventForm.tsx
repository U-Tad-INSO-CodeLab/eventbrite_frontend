import EventDatePicker from '@/events/components/EventDatePicker';
import CreateEventTiersSection from '@/creators/components/create-event/CreateEventTiersSection';
import type { CreatorTierTemplate } from '@/creators/lib/creatorTierTemplates';
import type { ChangeEventHandler, DragEventHandler, MouseEventHandler, RefObject, FormEventHandler } from 'react';
import { Alert, Box, Button, IconButton, InputBase, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
  onDescriptionChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
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
    <Box component="main" className="create-layout">
      <Box component="section">
        <Typography component="h1">Create Event</Typography>
        <Typography component="p">Set up your event and attract sponsors.</Typography>

        {error ? <Alert className="create-alert create-alert-error">{error}</Alert> : null}
        {success ? (
          <Alert className="create-alert create-alert-success">{success}</Alert>
        ) : null}

        <Box component="form" className="create-form" onSubmit={onSubmit}>
          <Box className="create-field">
            <Typography component="span" className="create-field-label" id="create-cover-label">
              Cover Image
            </Typography>
            <Box
              component="label"
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
                <Box className="create-upload-preview">
                  <img src={coverImageDataUrl} alt="Cover preview" />
                  <IconButton
                    type="button"
                    className="create-upload-clear"
                    onClick={onClearCover}
                    disabled={loading}
                    aria-label="Remove cover image"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Typography component="span">
                  Click to upload or drag and drop a cover image
                </Typography>
              )}
            </Box>
          </Box>

          <Box className="create-field">
            <Typography component="label" className="create-field-label" htmlFor="create-title">
              Event Title
            </Typography>
            <InputBase
              id="create-title"
              name="title"
              type="text"
              autoComplete="off"
              placeholder="e.g. TechConnect Summit 2026"
              value={title}
              onChange={onTitleChange}
              disabled={loading}
            />
          </Box>

          <Box className="create-field">
            <Typography
              component="label"
              className="create-field-label"
              htmlFor="create-description"
            >
              Description
            </Typography>
            <InputBase
              multiline
              id="create-description"
              name="description"
              placeholder="Describe your event..."
              value={description}
              onChange={onDescriptionChange}
              disabled={loading}
            />
          </Box>

          <Box className="create-grid">
            <Box className="create-field">
              <Typography component="label" className="create-field-label" htmlFor="create-date">
                Date
              </Typography>
              <EventDatePicker
                id="create-date"
                value={date}
                onChange={onDateChange}
                disabled={loading}
              />
            </Box>
            <Box className="create-field">
              <Typography
                component="label"
                className="create-field-label"
                htmlFor="create-location"
              >
                Location
              </Typography>
              <InputBase
                id="create-location"
                name="location"
                type="text"
                autoComplete="address-level2"
                placeholder="City, State"
                value={location}
                onChange={onLocationChange}
                disabled={loading}
              />
            </Box>
            <Box className="create-field">
              <Typography
                component="label"
                className="create-field-label"
                htmlFor="create-industry"
              >
                Industry
              </Typography>
              <InputBase
                id="create-industry"
                name="industry"
                type="text"
                placeholder="e.g. Technology"
                value={industry}
                onChange={onIndustryChange}
                disabled={loading}
              />
            </Box>
            <Box className="create-field">
              <Typography
                component="label"
                className="create-field-label"
                htmlFor="create-attendance"
              >
                Expected Attendance
              </Typography>
              <InputBase
                id="create-attendance"
                name="expectedAttendance"
                type="text"
                inputMode="numeric"
                placeholder="e.g. 5000"
                value={expectedAttendance}
                onChange={onExpectedAttendanceChange}
                disabled={loading}
              />
            </Box>
          </Box>

          <Box className="create-field">
            <Typography component="label" className="create-field-label" htmlFor="create-tags">
              Tags (comma-separated)
            </Typography>
            <InputBase
              id="create-tags"
              name="tags"
              type="text"
              placeholder="AI, SaaS, Networking"
              value={tags}
              onChange={onTagsChange}
              disabled={loading}
            />
          </Box>

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

          <Button type="submit" className="create-submit" disabled={loading} variant="contained">
            {loading ? 'Publishing...' : 'Publish Event'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
