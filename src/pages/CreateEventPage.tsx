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
  const addTierDisabled = form.tiers.some((tier) => {
    const hasName = tier.name.trim().length > 0;
    const price = Number(tier.priceUsd);
    const hasValidPrice = Number.isFinite(price) && price > 0;
    return !hasName || !hasValidPrice;
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
        tiers={form.tiers}
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
        onTierNameChange={(tierId, value) =>
          form.setTiers((currentTiers) =>
            currentTiers.map((tier) =>
              tier.id === tierId ? { ...tier, name: value } : tier
            )
          )
        }
        onTierPriceChange={(tierId, value) =>
          form.setTiers((currentTiers) =>
            currentTiers.map((tier) =>
              tier.id === tierId ? { ...tier, priceUsd: value } : tier
            )
          )
        }
        onTierBenefitsChange={(tierId, value) =>
          form.setTiers((currentTiers) =>
            currentTiers.map((tier) =>
              tier.id === tierId ? { ...tier, benefits: value } : tier
            )
          )
        }
        onAddTier={() =>
          form.setTiers((currentTiers) => [
            ...currentTiers,
            { id: crypto.randomUUID(), name: '', priceUsd: '', benefits: '' },
          ])
        }
        addTierDisabled={addTierDisabled}
        onRemoveTier={(tierId) =>
          form.setTiers((currentTiers) => {
            const nextTiers = currentTiers.filter((tier) => tier.id !== tierId);
            if (nextTiers.length === 0) {
              return [
                { id: crypto.randomUUID(), name: '', priceUsd: '', benefits: '' },
              ];
            }
            return nextTiers;
          })
        }
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
        tiers={form.tiers}
      />
    </div>
  );
}

export default function CreateEventPage() {
  const session = getMockSession();
  if (!session || session.role !== 'creator') return null;
  return <CreateEventContent session={session} />;
}
