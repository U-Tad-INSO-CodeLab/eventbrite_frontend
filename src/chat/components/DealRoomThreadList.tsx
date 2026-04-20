import type { MockUserRole } from '@/auth/lib/mockAuth';
import { formatRelativeTime, initials } from '@/chat/lib/dealRoomMessageUtils';
import { peerNameForThread, type MockDealThread } from '@/chat/lib/mockDealThreads';

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
  const unreadForRole = (t: MockDealThread) =>
    role === 'sponsor' ? t.unreadForSponsor : t.unreadForCreator;

  return (
    <aside className="deal-room-sidebar">
      <header className="deal-room-sidebar-head">
        <h1 className="deal-room-title">Deal Room</h1>
        <p className="deal-room-lead">Manage your sponsorship negotiations.</p>
      </header>
      <ul className="deal-room-thread-list">
        {threads.map((t) => {
          const peer = peerNameForThread(t, role);
          const active = t.id === selectedThreadId;
          const unread = unreadForRole(t);
          return (
            <li key={t.id}>
              <button
                type="button"
                className={`deal-room-thread-card${active ? ' is-active' : ''}`}
                onClick={() => onSelectThread(t.id)}
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
  );
}
