/** Nombre de evento Ably mock para mensajes de texto en Deal Room */
export const MOCK_CHAT_MESSAGE_EVENT = 'chat.message';

export function dealRoomChannelName(threadId: string): string {
  return `dealroom:${threadId}`;
}
