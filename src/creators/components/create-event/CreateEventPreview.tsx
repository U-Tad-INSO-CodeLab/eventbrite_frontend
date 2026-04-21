import { formatIsoDate } from '@/shared/lib/formatIsoDate';
import { Box, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupsIcon from '@mui/icons-material/Groups';

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
    <Box component="aside" className="create-preview" aria-label="Live preview">
      <Typography component="h2" className="create-preview-heading">
        <Box className="create-preview-eye" aria-hidden="true">
          <VisibilityIcon />
        </Box>
        Live Preview
      </Typography>
      <Box className="create-preview-card">
        <Box className="create-preview-media">
          {coverImageDataUrl ? (
            <img src={coverImageDataUrl} alt="" />
          ) : (
            <Box className="placeholder">Cover Image</Box>
          )}
        </Box>
        <Box className="create-preview-content">
          <Box component="strong">{title.trim() || 'e.g. TechConnect Summit 2026'}</Box>
          <Typography component="p">
            {description.trim() || 'Event description will appear here...'}
          </Typography>
          <Box component="ul" className="create-preview-meta-list">
            <li>
              <CalendarTodayIcon className="create-preview-meta-icon" aria-hidden="true" />
              {date ? formatIsoDate(date) : 'dd/mm/yyyy'}
            </li>
            <li>
              <LocationOnIcon className="create-preview-meta-icon" aria-hidden="true" />
              {location.trim() || 'City, State'}
            </li>
            <li>
              <GroupsIcon className="create-preview-meta-icon" aria-hidden="true" />
              {expectedAttendance.trim() || '0'}
            </li>
          </Box>
          <Box className="create-preview-tags">
            {(previewTags.length > 0 ? previewTags : ['AI', 'SaaS', 'Networking']).map(
              (tag) => (
                <Box component="span" key={tag}>
                  {tag}
                </Box>
              )
            )}
          </Box>
          {previewTiers.length > 0 ? (
            <Box component="section" className="create-preview-tiers">
              <Typography component="h4">Sponsorship Tiers</Typography>
              <Box component="ul">
                {previewTiers.map((tier) => (
                  <li key={tier.id}>
                    <Box className="create-preview-tier-top">
                      <Box component="strong">{tier.name}</Box>
                      <Box component="span">${tier.price.toLocaleString()}</Box>
                    </Box>
                    {tier.benefits.length > 0 ? (
                      <Typography component="p">{tier.benefits.join(' · ')}</Typography>
                    ) : null}
                  </li>
                ))}
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
