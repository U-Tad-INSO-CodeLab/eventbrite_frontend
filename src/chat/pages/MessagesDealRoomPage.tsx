import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { MockSessionUser } from '@/auth/lib/mockAuth';
import { getMockSession } from '@/auth/lib/mockAuth';
import { MOCK_CHAT_MESSAGE_EVENT, dealRoomChannelName } from '@/chat/constants';
import { useMockAblyChannel } from '@/chat/hooks/useMockAblyChannel';
import type { MockAblyInboundMessage } from '@/chat/lib/mockAblyChat';
import {
  getDealThreadById,
  listDealThreadsForUser,
  markThreadRead,
  peerNameForThread,
  updateThreadPreview,
  type MockDealThread,
} from '@/chat/lib/mockDealThreads';
import '@/chat/styles/deal-room.css';

const QUICK_REPLIES = [
  'Can you share the sponsorship overview?',
  "What's the expected timeline?",
  'Happy to jump on a short call this week.',
  'Could you confirm the next steps in writing?',
];

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return '';
  const diffMs = Date.now() - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function formatClock(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Clave de día local (YYYY-MM-DD) para agrupar burbujas. */
function calendarDayKey(ts: number): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDaySeparatorLabel(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const yday = new Date(now);
  yday.setDate(yday.getDate() - 1);
  if (calendarDayKey(ts) === calendarDayKey(now.getTime())) return 'Today';
  if (calendarDayKey(ts) === calendarDayKey(yday.getTime())) return 'Yesterday';
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function parseChatMessage(msg: MockAblyInboundMessage): {
  senderId: string;
  senderName: string;
  senderRole: 'sponsor' | 'creator';
  body: string;
} | null {
  if (msg.name !== MOCK_CHAT_MESSAGE_EVENT) return null;
  const { data } = msg;
  const senderId = typeof data.senderId === 'string' ? data.senderId : '';
  const senderName = typeof data.senderName === 'string' ? data.senderName : '';
  const senderRole = data.senderRole === 'sponsor' || data.senderRole === 'creator' ? data.senderRole : null;
  const body = typeof data.body === 'string' ? data.body : '';
  if (!senderId || !senderRole || !body) return null;
  return { senderId, senderName, senderRole, body };
}

type ChatPaneProps = {
  session: MockSessionUser;
  thread: MockDealThread;
  peerName: string;
  onAfterSend: () => void;
};

function DealRoomChatPane({ session, thread, peerName, onAfterSend }: ChatPaneProps) {
  const channelName = dealRoomChannelName(thread.id);
  const { messages, publish } = useMockAblyChannel(channelName, MOCK_CHAT_MESSAGE_EVENT);
  const [draft, setDraft] = useState('');
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
          <div
            key={`day-sep-${dayKey}`}
            className="deal-room-day-sep"
            role="separator"
            aria-label={label}
          >
            <span className="deal-room-day-sep-line" aria-hidden="true" />
            <time className="deal-room-day-sep-label" dateTime={dayKey}>
              {label}
            </time>
            <span className="deal-room-day-sep-line" aria-hidden="true" />
          </div>
        );
      }
      const mine = parsed.senderId === session.id;
      nodes.push(
        <div
          key={msg.id}
          className={`deal-room-bubble-row${mine ? ' deal-room-bubble-row--mine' : ''}`}
        >
          <div className={`deal-room-bubble${mine ? ' deal-room-bubble--mine' : ''}`}>
            <p className="deal-room-bubble-text">{parsed.body}</p>
            <time className="deal-room-bubble-time" dateTime={new Date(msg.timestamp).toISOString()}>
              {formatClock(msg.timestamp)}
            </time>
          </div>
        </div>
      );
    }
    return nodes;
  }, [messages, session.id]);

  return (
    <>
      <header className="deal-room-chat-head">
        <div className="deal-room-chat-peer">
          <span className="deal-room-avatar deal-room-avatar--lg" aria-hidden="true">
            {initials(peerName)}
          </span>
          <div>
            <div className="deal-room-chat-name">{peerName}</div>
            <div className="deal-room-chat-event">{thread.eventTitle}</div>
          </div>
        </div>
      </header>

      <div className="deal-room-chat-tab" role="heading" aria-level={2}>
        Chat
      </div>

      <div className="deal-room-messages">
        {messageBlocks}
        <div ref={listEndRef} />
      </div>

      <div className="deal-room-compose">
        <div className="deal-room-quick" aria-label="Suggested replies">
          {QUICK_REPLIES.map((q) => (
            <button
              key={q}
              type="button"
              className="deal-room-quick-btn"
              onClick={() => sendMessage(q)}
            >
              {q}
            </button>
          ))}
        </div>
        <div className="deal-room-input-row">
          <label className="deal-room-input-label" htmlFor="deal-room-message-input">
            <span className="deal-room-sr-only">Message</span>
            <input
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
          </label>
          <button type="button" className="deal-room-send" onClick={sendDraft} aria-label="Send message">
            <span className="material-symbols-outlined" aria-hidden="true">
              send
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

export default function MessagesDealRoomPage() {
  const session = getMockSession();
  const [searchParams, setSearchParams] = useSearchParams();
  const [threads, setThreads] = useState<MockDealThread[]>(() => {
    const s = getMockSession();
    if (!s || (s.role !== 'sponsor' && s.role !== 'creator')) return [];
    return listDealThreadsForUser(s.id, s.role);
  });
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(() => {
    const s = getMockSession();
    if (!s || (s.role !== 'sponsor' && s.role !== 'creator')) return null;
    const list = listDealThreadsForUser(s.id, s.role);
    return list[0]?.id ?? null;
  });
  const hydrated = useRef(false);

  const reloadThreads = useCallback(() => {
    if (!session) return;
    setThreads(listDealThreadsForUser(session.id, session.role));
  }, [session]);

  useEffect(() => {
    if (!session || hydrated.current) return;
    hydrated.current = true;
    const list = listDealThreadsForUser(session.id, session.role);
    setThreads(list);
    const fromUrl = searchParams.get('thread');
    const id = fromUrl && list.some((t) => t.id === fromUrl) ? fromUrl : list[0]?.id ?? null;
    setSelectedThreadId(id);
    if (id) {
      markThreadRead(id, session.role);
      if (!fromUrl) {
        const next = new URLSearchParams(searchParams);
        next.set('thread', id);
        setSearchParams(next, { replace: true });
      }
      setThreads(listDealThreadsForUser(session.id, session.role));
    }
    // Solo hidratación inicial: la URL se actualiza al cambiar de hilo desde `selectThread`.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- leer `searchParams` una vez al montar
  }, [session]);

  const selectedThread = useMemo(
    () => (selectedThreadId ? getDealThreadById(selectedThreadId) : undefined),
    [selectedThreadId]
  );

  const selectThread = useCallback(
    (id: string) => {
      if (!session) return;
      markThreadRead(id, session.role);
      setSelectedThreadId(id);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('thread', id);
          return next;
        },
        { replace: true }
      );
      setThreads(listDealThreadsForUser(session.id, session.role));
    },
    [session, setSearchParams]
  );

  if (!session || (session.role !== 'sponsor' && session.role !== 'creator')) {
    return null;
  }

  if (threads.length === 0) {
    return (
      <div className="deal-room-page-wrap">
        <div className="deal-room deal-room--empty">
          <h1 className="deal-room-title">Deal Room</h1>
          <p className="deal-room-lead">Manage your sponsorship conversations.</p>
          <p className="deal-room-empty-msg">
            No conversations yet. When you connect with organizers, threads will appear here.
          </p>
        </div>
      </div>
    );
  }

  const peerName = selectedThread ? peerNameForThread(selectedThread, session.role) : '';
  const unreadForRole = (t: MockDealThread) =>
    session.role === 'sponsor' ? t.unreadForSponsor : t.unreadForCreator;

  return (
    <div className="deal-room-page-wrap">
      <div className="deal-room">
        <aside className="deal-room-sidebar">
          <header className="deal-room-sidebar-head">
            <h1 className="deal-room-title">Deal Room</h1>
            <p className="deal-room-lead">Manage your sponsorship negotiations.</p>
          </header>
          <ul className="deal-room-thread-list">
            {threads.map((t) => {
              const peer = peerNameForThread(t, session.role);
              const active = t.id === selectedThreadId;
              const unread = unreadForRole(t);
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    className={`deal-room-thread-card${active ? ' is-active' : ''}`}
                    onClick={() => selectThread(t.id)}
                  >
                    <span className="deal-room-avatar" aria-hidden="true">
                      {initials(peer)}
                    </span>
                    <div className="deal-room-thread-main">
                      <div className="deal-room-thread-top">
                        <span className="deal-room-thread-name">{peer}</span>
                        <div className="deal-room-thread-meta">
                          <span className="deal-room-thread-time">{formatRelativeTime(t.lastAt)}</span>
                          {unread > 0 ? (
                            <span
                              className="deal-room-unread"
                              aria-label={`${unread} unread`}
                              data-wide={unread > 9 ? 'true' : undefined}
                            >
                              {unread > 9 ? '9+' : String(unread)}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="deal-room-thread-event">{t.eventTitle}</div>
                      <div className="deal-room-thread-preview">{t.lastPreview}</div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="deal-room-main" aria-label="Conversation">
          {selectedThread ? (
            <DealRoomChatPane
              key={selectedThread.id}
              session={session}
              thread={selectedThread}
              peerName={peerName}
              onAfterSend={reloadThreads}
            />
          ) : (
            <p className="deal-room-empty-msg">Select a conversation.</p>
          )}
        </section>
      </div>
    </div>
  );
}
