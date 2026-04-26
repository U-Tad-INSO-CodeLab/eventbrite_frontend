import type { MockUserRole } from '@/auth/lib/mockAuth';
import { Box, Button, Typography } from '@mui/material';
import { formatRelativeTime, initials } from '@/chat/lib/dealRoomMessageUtils';
import {
  peerNameForThread,
  threadUnreadTotal,
  type MockDealThread,
} from '@/chat/lib/mockDealThreads';

type DealRoomThreadListProps = {
  threads: MockDealThread[];
  selectedThreadId: string | null;
  role: MockUserRole;
  onSelectThread: (threadId: string) => void;
};

export default function DealRoomThreadList({
  threads,
  selectedThreadId,
  role,
  onSelectThread,
}: DealRoomThreadListProps) {
  const unreadForRole = (t: MockDealThread) => threadUnreadTotal(t, role);

  return (
    <Box component="aside" className="deal-room-sidebar">
      <Box component="header" className="deal-room-sidebar-head">
        <Typography component="h1" className="deal-room-title">
          Deal Room
        </Typography>
        <Typography component="p" className="deal-room-lead">
          Manage your sponsorship negotiations.
        </Typography>
      </Box>
      <Box component="ul" className="deal-room-thread-list">
        {threads.map((t) => {
          const peer = peerNameForThread(t, role);
          const active = t.id === selectedThreadId;
          const unread = unreadForRole(t);
          return (
            <li key={t.id}>
              <Button
                type="button"
                className={`deal-room-thread-card${active ? ' is-active' : ''}`}
                onClick={() => onSelectThread(t.id)}
                variant="text"
                disableElevation
                disableRipple
              >
                <Box component="span" className="deal-room-avatar" aria-hidden="true">
                  {initials(peer)}
                </Box>
                <Box className="deal-room-thread-main">
                  <Box className="deal-room-thread-top">
                    <Box component="span" className="deal-room-thread-name">
                      {peer}
                    </Box>
                    <Box className="deal-room-thread-meta">
                      <Box component="span" className="deal-room-thread-time">
                        {formatRelativeTime(t.lastAt)}
                      </Box>
                      {unread > 0 ? (
                        <Box
                          component="span"
                          className="deal-room-unread"
                          aria-label={`${unread} unread`}
                          data-wide={unread > 9 ? 'true' : undefined}
                        >
                          {unread > 9 ? '9+' : String(unread)}
                        </Box>
                      ) : null}
                    </Box>
                  </Box>
                  <Box className="deal-room-thread-event">{t.eventTitle}</Box>
                  <Box className="deal-room-thread-preview">{t.lastPreview}</Box>
                </Box>
              </Button>
            </li>
          );
        })}
      </Box>
    </Box>
  );
}
