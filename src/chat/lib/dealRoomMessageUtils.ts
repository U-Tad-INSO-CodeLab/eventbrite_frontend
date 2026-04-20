import { MOCK_CHAT_MESSAGE_EVENT } from '@/chat/constants';
import type { MockAblyInboundMessage } from '@/chat/lib/mockAblyChat';

export function formatRelativeTime(iso: string): string {
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

export function formatClock(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function calendarDayKey(ts: number): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatDaySeparatorLabel(ts: number): string {
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

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export type ParsedDealChatMessage = {
  senderId: string;
  senderName: string;
  senderRole: 'sponsor' | 'creator';
  body: string;
};

export function parseChatMessage(msg: MockAblyInboundMessage): ParsedDealChatMessage | null {
  if (msg.name !== MOCK_CHAT_MESSAGE_EVENT) return null;
  const { data } = msg;
  const senderId = typeof data.senderId === 'string' ? data.senderId : '';
  const senderName = typeof data.senderName === 'string' ? data.senderName : '';
  const senderRole =
    data.senderRole === 'sponsor' || data.senderRole === 'creator' ? data.senderRole : null;
  const body = typeof data.body === 'string' ? data.body : '';
  if (!senderId || !senderRole || !body) return null;
  return { senderId, senderName, senderRole, body };
}
