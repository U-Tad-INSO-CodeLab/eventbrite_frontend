import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import { Box, Button, IconButton, InputBase } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import type { MockSessionUser } from '@/auth/lib/mockAuth';
import { MOCK_CHAT_MESSAGE_EVENT, dealRoomChannelName } from '@/chat/constants';
import { useMockAblyChannel } from '@/chat/hooks/useMockAblyChannel';
import {
  calendarDayKey,
  formatClock,
  formatDaySeparatorLabel,
  initials,
  parseChatMessage,
} from '@/chat/lib/dealRoomMessageUtils';
import { updateThreadPreview, type MockDealThread } from '@/chat/lib/mockDealThreads';

const QUICK_REPLIES = [
  'Can you share the sponsorship overview?',
  "What's the expected timeline?",
  'Happy to jump on a short call this week.',
  'Could you confirm the next steps in writing?',
];

type DealRoomChatPaneProps = {
  session: MockSessionUser;
  thread: MockDealThread;
  peerName: string;
  initialDraft?: string;
  onAfterSend: () => void;
};

export default function DealRoomChatPane({
  session,
  thread,
  peerName,
  initialDraft = '',
  onAfterSend,
}: DealRoomChatPaneProps) {
  const channelName = dealRoomChannelName(thread.id);
  const { messages, publish } = useMockAblyChannel(channelName, MOCK_CHAT_MESSAGE_EVENT);
  const [draft, setDraft] = useState(() => messages.length === 0 ? initialDraft : '');
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(
    (body: string) => {
      const trimmed = body.trim();
      if (!trimmed) return;
      publish(MOCK_CHAT_MESSAGE_EVENT, {
        senderId: session.id,
        senderName: session.fullName,
        senderRole: session.role,
        body: trimmed,
      });
      updateThreadPreview(thread.id, trimmed, Date.now());
      onAfterSend();
    },
    [onAfterSend, publish, session, thread.id]
  );

  const sendDraft = useCallback(() => {
    const body = draft.trim();
    if (!body) return;
    sendMessage(body);
    setDraft('');
  }, [draft, sendMessage]);

  const messageBlocks = useMemo(() => {
    const ordered = [...messages].sort((a, b) => a.timestamp - b.timestamp);
    let prevDayKey: string | null = null;
    const nodes: ReactElement[] = [];
    for (const msg of ordered) {
      const parsed = parseChatMessage(msg);
      if (!parsed) continue;
      const dayKey = calendarDayKey(msg.timestamp);
      if (prevDayKey !== dayKey) {
        prevDayKey = dayKey;
        const label = formatDaySeparatorLabel(msg.timestamp);
        nodes.push(
          <Box
            key={`day-sep-${dayKey}`}
            className="deal-room-day-sep"
            role="separator"
            aria-label={label}
          >
            <Box component="span" className="deal-room-day-sep-line" aria-hidden="true" />
            <time className="deal-room-day-sep-label" dateTime={dayKey}>
              {label}
            </time>
            <Box component="span" className="deal-room-day-sep-line" aria-hidden="true" />
          </Box>
        );
      }
      const mine = parsed.senderId === session.id;
      nodes.push(
        <Box
          key={msg.id}
          className={`deal-room-bubble-row${mine ? ' deal-room-bubble-row--mine' : ''}`}
        >
          <Box className={`deal-room-bubble${mine ? ' deal-room-bubble--mine' : ''}`}>
            <Box component="p" className="deal-room-bubble-text">
              {parsed.body}
            </Box>
            <time className="deal-room-bubble-time" dateTime={new Date(msg.timestamp).toISOString()}>
              {formatClock(msg.timestamp)}
            </time>
          </Box>
        </Box>
      );
    }
    return nodes;
  }, [messages, session.id]);

  return (
    <>
      <Box component="header" className="deal-room-chat-head">
        <Box className="deal-room-chat-peer">
          <Box component="span" className="deal-room-avatar deal-room-avatar--lg" aria-hidden="true">
            {initials(peerName)}
          </Box>
          <Box>
            <Box className="deal-room-chat-name">{peerName}</Box>
            <Box className="deal-room-chat-event">{thread.eventTitle}</Box>
          </Box>
        </Box>
      </Box>

      <Box className="deal-room-chat-tab" role="heading" aria-level={2}>
        Chat
      </Box>

      <Box className="deal-room-messages">
        {messageBlocks}
        <Box ref={listEndRef} />
      </Box>

      <Box className="deal-room-compose">
        <Box className="deal-room-quick" aria-label="Suggested replies">
          {QUICK_REPLIES.map((q) => (
            <Button
              key={q}
              type="button"
              className="deal-room-quick-btn"
              onClick={() => sendMessage(q)}
              variant="text"
              disableElevation
              disableRipple
            >
              {q}
            </Button>
          ))}
        </Box>
        <Box className="deal-room-input-row">
          <Box component="label" className="deal-room-input-label" htmlFor="deal-room-message-input">
            <Box component="span" className="deal-room-sr-only">
              Message
            </Box>
            <InputBase
              id="deal-room-message-input"
              type="text"
              className="deal-room-input"
              placeholder="Type a message..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendDraft();
                }
              }}
            />
          </Box>
          <IconButton type="button" className="deal-room-send" onClick={sendDraft} aria-label="Send message">
            <SendIcon fontSize="inherit" aria-hidden="true" />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}
