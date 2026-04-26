import { useEffect, useState } from 'react';
import type { MockUserRole } from '@/auth/lib/mockAuth';
import {
  DEAL_THREADS_CHANGED_EVENT,
  listDealThreadsForUser,
  threadUnreadTotal,
} from '@/chat/lib/mockDealThreads';

/** Number of deal threads with any unread chat or proposal activity for this user. */
export function useMessagesNavUnreadThreadCount(userId: string | undefined, role: MockUserRole | undefined) {
  const [refreshKey, setRefreshKey] = useState(0);
  void refreshKey;

  useEffect(() => {
    const handleThreadsChanged = () => setRefreshKey((value) => value + 1);
    window.addEventListener(DEAL_THREADS_CHANGED_EVENT, handleThreadsChanged);
    return () => window.removeEventListener(DEAL_THREADS_CHANGED_EVENT, handleThreadsChanged);
  }, []);

  if (!userId || !role) return 0;
  const threads = listDealThreadsForUser(userId, role);
  const n = threads.filter((t) => threadUnreadTotal(t, role) > 0).length;
  const count = Math.min(n, 99);

  return count;
}
