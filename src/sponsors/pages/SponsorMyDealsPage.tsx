import { Box, IconButton, Typography } from '@mui/material';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import { Link } from 'react-router-dom';
import { getMockSession } from '@/auth/lib/mockAuth';
import { initials } from '@/chat/lib/dealRoomMessageUtils';
import { listDealThreadsForUser } from '@/chat/lib/mockDealThreads';
import { dealNegotiationStatusLabel } from '@/chat/lib/mockDealProposals';
import { listSponsorDealSummaries } from '@/sponsors/lib/mockSponsorDeals';
import '@/sponsors/pages/SponsorMyDealsPage.css';

export default function SponsorMyDealsPage() {
  const session = getMockSession();
  if (!session || session.role !== 'sponsor') return null;

  const threads = listDealThreadsForUser(session.id, 'sponsor');
  const deals = listSponsorDealSummaries(session.id);

  return (
    <Box className="sponsor-deals-page">
      <Box className="sponsor-deals-header">
        <Typography component="h1" className="sponsor-deals-title">
          My Deals
        </Typography>
        <Typography component="p" className="sponsor-deals-subtitle">
          Track and manage your sponsorship offers.
        </Typography>
      </Box>

      {threads.length === 0 ? (
        <Typography component="p" className="sponsor-deals-empty">
          No deals yet. Discover events and start a conversation to see them here.
        </Typography>
      ) : (
        <Box className="sponsor-deals-list" component="ul">
          {deals.map((d) => {
            const av = initials(d.organizerName || 'Organizer');
            return (
              <Box key={d.threadId} component="li" className="sponsor-deals-card">
                <Box component="span" className="sponsor-deals-avatar" aria-hidden="true">
                  {av}
                </Box>
                <Box className="sponsor-deals-card-main">
                  <Typography component="h2" className="sponsor-deals-card-title">
                    {d.eventTitle}
                  </Typography>
                  <Typography component="p" className="sponsor-deals-card-meta">
                    {d.detailLine}
                  </Typography>
                </Box>
                <Typography component="span" className="sponsor-deals-card-amount">
                  {d.amountLabel}
                </Typography>
                <span
                  className={`sponsor-deals-status sponsor-deals-status--${d.status}`}
                >
                  {dealNegotiationStatusLabel(d.status)}
                </span>
                <IconButton
                  component={Link}
                  to={`/sponsor/messages?thread=${encodeURIComponent(d.threadId)}`}
                  className="sponsor-deals-chat-btn"
                  aria-label={`Open deal room for ${d.eventTitle}`}
                  size="medium"
                >
                  <ChatBubbleOutlinedIcon fontSize="small" aria-hidden />
                </IconButton>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
