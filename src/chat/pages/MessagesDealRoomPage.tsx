import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMockSession } from '@/auth/lib/mockAuth';
import DealRoomChatPane from '@/chat/components/DealRoomChatPane';
import DealRoomEmptyState from '@/chat/components/DealRoomEmptyState';
import DealRoomThreadList from '@/chat/components/DealRoomThreadList';
import {
  listDealThreadsForUser,
  markThreadRead,
  peerNameForThread,
  type MockDealThread,
} from '@/chat/lib/mockDealThreads';
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
  const [threads, setThreads] = useState<MockDealThread[]>([]);

  const refreshThreads = useCallback(() => {
    const s = getMockSession();
    if (!isDealSession(s)) return;
    setThreads(listDealThreadsForUser(s.id, s.role));
  }, []);

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
    markThreadRead(id, s.role);
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
    <div className="deal-room-page-wrap">
      <div className="deal-room">
        <DealRoomThreadList
          threads={threads}
          selectedThreadId={selectedThreadId}
          role={session.role}
          onSelectThread={selectThread}
        />
        <section className="deal-room-main" aria-label="Conversation">
          {selectedThread ? (
            <DealRoomChatPane
              key={selectedThread.id}
              session={session}
              thread={selectedThread}
              peerName={peerName}
              onAfterSend={refreshThreads}
            />
          ) : (
            <p className="deal-room-empty-msg">Select a conversation.</p>
          )}
        </section>
      </div>
    </div>
  );
}
