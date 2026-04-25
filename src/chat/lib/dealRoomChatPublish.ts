import type { MockUserRole } from '@/auth/lib/mockAuth';
import { MOCK_CHAT_MESSAGE_EVENT, dealRoomChannelName } from '@/chat/constants';
import { createMockAblyRealtime } from '@/chat/lib/mockAblyChat';

export function publishDealThreadChatMessage(input: {
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: MockUserRole;
  body: string;
  timestamp?: number;
}): void {
  const ch = createMockAblyRealtime().channels.get(dealRoomChannelName(input.threadId));
  ch.publish(
    MOCK_CHAT_MESSAGE_EVENT,
    {
      senderId: input.senderId,
      senderName: input.senderName,
      senderRole: input.senderRole,
      body: input.body,
    },
    input.timestamp
  );
}
