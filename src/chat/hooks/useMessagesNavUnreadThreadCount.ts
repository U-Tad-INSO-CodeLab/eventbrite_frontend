import { useCallback, useEffect, useState } from 'react';
import type { MockUserRole } from '@/auth/lib/mockAuth';
import {
  DEAL_THREADS_CHANGED_EVENT,
  listDealThreadsForUser,
  threadUnreadTotal,
} from '@/chat/lib/mockDealThreads';

/** Number of deal threads with any unread chat or proposal activity for this user. */
export function useMessagesNavUnreadThreadCount(userId: string | undefined, role: MockUserRole | undefined) {
  const [count, setCount] = useState(0);

  const recompute = useCallback(() => {
    if (!userId || !role) {
      setCount(0);
      return;
    }
    const threads = listDealThreadsForUser(userId, role);
    const n = threads.filter((t) => threadUnreadTotal(t, role) > 0).length;
    setCount(Math.min(n, 99));
  }, [userId, role]);

  useEffect(() => {
    recompute();
    window.addEventListener(DEAL_THREADS_CHANGED_EVENT, recompute);
    return () => window.removeEventListener(DEAL_THREADS_CHANGED_EVENT, recompute);
  }, [recompute]);

  return count;
}
