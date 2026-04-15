import { useNavigate } from 'react-router-dom';
import CreateEventForm from '../components/create-event/CreateEventForm';
import CreateEventPreview from '../components/create-event/CreateEventPreview';
import { getMockSession, type MockSessionUser } from '../lib/mockAuth';
import { useCreateEventForm } from './useCreateEventForm';
import './createEvent.css';

function CreateEventContent({ session }: { session: MockSessionUser }) {
  const navigate = useNavigate();
  const form = useCreateEventForm({
    session,
    onCreated: () => navigate('/creator'),
  });

  return (
    <div className="create-body">
      <CreateEventForm
        title={form.title}
        description={form.description}
        date={form.date}
        location={form.location}
        industry={form.industry}
        expectedAttendance={form.expectedAttendance}
        tags={form.tags}
        coverImageDataUrl={form.coverImageDataUrl}
        coverDragging={form.coverDragging}
        coverInputRef={form.coverInputRef}
        error={form.error}
        success={form.success}
        loading={form.loading}
        onTitleChange={(e) => form.setTitle(e.target.value)}
        onDescriptionChange={(e) => form.setDescription(e.target.value)}
        onDateChange={form.setDate}
        onLocationChange={(e) => form.setLocation(e.target.value)}
        onIndustryChange={(e) => form.setIndustry(e.target.value)}
        onExpectedAttendanceChange={(e) =>
          form.setExpectedAttendance(e.target.value)
        }
        onTagsChange={(e) => form.setTags(e.target.value)}
        onCoverUpload={form.handleCoverUpload}
        onCoverDragEnter={form.handleCoverDragEnter}
        onCoverDragOver={form.handleCoverDragOver}
        onCoverDragLeave={form.handleCoverDragLeave}
        onCoverDrop={form.handleCoverDrop}
        onClearCover={form.handleClearCover}
        onSubmit={form.handleSubmit}
      />
      <CreateEventPreview
        coverImageDataUrl={form.coverImageDataUrl}
        title={form.title}
        description={form.description}
        date={form.date}
        location={form.location}
        expectedAttendance={form.expectedAttendance}
        previewTags={form.previewTags}
      />
    </div>
  );
}

export default function CreateEventPage() {
  const session = getMockSession();
  if (!session || session.role !== 'creator') return null;
  return <CreateEventContent session={session} />;
}
