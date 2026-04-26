import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { getMockSession } from '@/auth/lib/mockAuth';
import DealRoomChatPane from '@/chat/components/DealRoomChatPane';
import DealRoomEmptyState from '@/chat/components/DealRoomEmptyState';
import DealRoomThreadList from '@/chat/components/DealRoomThreadList';
import { listDealThreadsForUser, peerNameForThread, type MockDealThread } from '@/chat/lib/mockDealThreads';
import '@/chat/styles/deal-room.css';

function isDealSession(
  s: ReturnType<typeof getMockSession>
): s is NonNullable<typeof s> & { role: 'sponsor' | 'creator' } {
  return Boolean(s && (s.role === 'sponsor' || s.role === 'creator'));
}

export default function MessagesDealRoomPage() {
  const session = getMockSession();
  const [searchParams, setSearchParams] = useSearchParams();
  /** Primitive for deps (avoid mutable `searchParams` in memo lists). */
  const threadKey = searchParams.get('thread') ?? '';
  const initialDraft = searchParams.get('draft') ?? '';
  const [threads, setThreads] = useState<MockDealThread[]>([]);

  const refreshThreads = useCallback(() => {
    const s = getMockSession();
    if (!isDealSession(s)) return;
    setThreads(listDealThreadsForUser(s.id, s.role));
  }, []);

  /* Reload threads when returning to the tab (e.g. sponsor sent a proposal in another tab). */
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      refreshThreads();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refreshThreads]);

  /* Bootstrap list + URL from localStorage (mock external store). */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const s = getMockSession();
    if (!isDealSession(s)) {
      setThreads([]);
      return;
    }
    const list = listDealThreadsForUser(s.id, s.role);
    if (list.length === 0) {
      setThreads([]);
      return;
    }
    const id =
      threadKey && list.some((t) => t.id === threadKey) ? threadKey : list[0].id;
    setThreads(listDealThreadsForUser(s.id, s.role));
    if (threadKey !== id) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('thread', id);
          return next;
        },
        { replace: true }
      );
    }
  }, [threadKey, setSearchParams, session?.id, session?.role]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const selectedThreadId =
    threads.length === 0
      ? null
      : threadKey && threads.some((t) => t.id === threadKey)
        ? threadKey
        : threads[0]?.id ?? null;

  const selectedThread = selectedThreadId
    ? threads.find((t) => t.id === selectedThreadId)
    : undefined;

  const selectThread = useCallback(
    (id: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('thread', id);
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  if (!isDealSession(session)) {
    return null;
  }

  if (threads.length === 0) {
    return <DealRoomEmptyState />;
  }

  const peerName = selectedThread ? peerNameForThread(selectedThread, session.role) : '';

  return (
    <Box className="deal-room-page-wrap">
      <Box className="deal-room">
        <DealRoomThreadList
          threads={threads}
          selectedThreadId={selectedThreadId}
          role={session.role}
          onSelectThread={selectThread}
        />
        <Box component="section" className="deal-room-main" aria-label="Conversation">
          {selectedThread ? (
            <DealRoomChatPane
              key={selectedThread.id}
              session={session}
              thread={selectedThread}
              peerName={peerName}
              initialDraft={initialDraft}
              onAfterSend={refreshThreads}
            />
          ) : (
            <Typography component="p" className="deal-room-empty-msg">
              Select a conversation.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
