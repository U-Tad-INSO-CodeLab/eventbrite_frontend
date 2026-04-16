import { useMemo, useRef, useState, type ChangeEvent, type DragEvent, type MouseEvent, type SubmitEventHandler } from 'react';
import type { MockSessionUser } from '../lib/mockAuth';
import { createMockEvent } from '../lib/mockEvents';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Could not read the uploaded file.'));
    reader.readAsDataURL(file);
  });
}

type UseCreateEventFormArgs = {
  session: MockSessionUser;
  onCreated: () => void;
};

type DraftTier = {
  id: string;
  name: string;
  priceUsd: string;
  benefits: string;
};

export function useCreateEventForm({ session, onCreated }: UseCreateEventFormArgs) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [expectedAttendance, setExpectedAttendance] = useState('');
  const [tags, setTags] = useState('');
  const [tiers, setTiers] = useState<DraftTier[]>([
    { id: crypto.randomUUID(), name: '', priceUsd: '', benefits: '' },
  ]);
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
      setError('Please enter an event title.');
      return;
    }
    if (!description.trim()) {
      setError('Please enter an event description.');
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
        sponsorshipTiers: tiers.map((tier) => ({
          name: tier.name,
          priceUsd: Number(tier.priceUsd) || 0,
          benefits: tier.benefits
            .split(',')
            .map((benefit) => benefit.trim())
            .filter(Boolean),
        })),
      });
      setLoading(false);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setSuccess('Event published to mock storage successfully.');
      setTimeout(() => onCreated(), 500);
    })();
  };

  return {
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
    previewTags,
    setTitle,
    setDescription,
    setDate,
    setLocation,
    setIndustry,
    setExpectedAttendance,
    setTags,
    setTiers,
    setError,
    handleCoverUpload,
    handleCoverDragEnter,
    handleCoverDragOver,
    handleCoverDragLeave,
    handleCoverDrop,
    handleClearCover,
    handleSubmit,
  };
}

export type CreateEventFormModel = ReturnType<typeof useCreateEventForm>;
