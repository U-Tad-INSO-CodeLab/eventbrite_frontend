import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createMockAblyRealtime,
  listMessagesForEvent,
  type MockAblyInboundMessage,
} from '@/chat/lib/mockAblyChat';

/**
 * Generic mock Ably channel hook.
 * Subscribes to a channel + optional event name, returns messages and a publish fn.
 * When a real backend is available, swap `createMockAblyRealtime` for the Ably SDK.
 */
export function useMockAblyChannel(channelName: string, eventName?: string) {
  const client = useMemo(() => createMockAblyRealtime(), []);

  const [messages, setMessages] = useState<MockAblyInboundMessage[]>(() =>
    eventName ? listMessagesForEvent(channelName, eventName) : []
  );

  useEffect(() => {
    const channel = client.channels.get(channelName);

    const onMessage = (msg: MockAblyInboundMessage) => {
      if (eventName && msg.name !== eventName) return;
      setMessages((prev) => {
        if (prev.some((p) => p.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    channel.subscribe(onMessage);
    return () => {
      channel.unsubscribe(onMessage);
    };
  }, [channelName, eventName, client]);

  const publish = useCallback(
    (event: string, data: Record<string, unknown>) => {
      client.channels.get(channelName).publish(event, data);
    },
    [channelName, client]
  );

  return {
    connectionState: client.connection.state,
    messages,
    publish,
    channelName,
  } as const;
}
