import { Box, Typography } from '@mui/material';

export default function DealRoomEmptyState() {
  return (
    <Box className="deal-room-page-wrap">
      <Box className="deal-room deal-room--empty">
        <Typography component="h1" className="deal-room-title">
          Deal Room
        </Typography>
        <Typography component="p" className="deal-room-lead">
          Manage your sponsorship conversations.
        </Typography>
        <Typography component="p" className="deal-room-empty-msg">
          No conversations yet. When you connect with organizers, threads will appear here.
        </Typography>
      </Box>
    </Box>
  );
}
