/**
 * Mock de Ably Realtime para desarrollo: mismas ideas (channels, subscribe, publish)
 * sin red ni SDK. Persistencia en localStorage + evento storage para otras pestañas.
 */

const STORAGE_PREFIX = 'eventlink_mock_ably_channel:';

export type MockAblyConnectionState = 'connected' | 'disconnected';

export type MockAblyInboundMessage = {
  id: string;
  name: string;
  data: Record<string, unknown>;
  timestamp: number;
};

type MessageListener = (msg: MockAblyInboundMessage) => void;

type ChannelBucket = {
  listeners: Set<MessageListener>;
  messages: MockAblyInboundMessage[];
};

const buckets = new Map<string, ChannelBucket>();

function storageKey(channelName: string) {
  return `${STORAGE_PREFIX}${channelName}`;
}

function readStoredMessages(channelName: string): MockAblyInboundMessage[] {
  try {
    const raw = localStorage.getItem(storageKey(channelName));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MockAblyInboundMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredMessages(
  channelName: string,
  messages: MockAblyInboundMessage[]
) {
  const max = 500;
  const trimmed = messages.slice(-max);
  localStorage.setItem(storageKey(channelName), JSON.stringify(trimmed));
}

function getBucket(channelName: string): ChannelBucket {
  let b = buckets.get(channelName);
  if (!b) {
    b = { listeners: new Set(), messages: readStoredMessages(channelName) };
    buckets.set(channelName, b);
  }
  return b;
}

/** Lectura inicial para React sin efecto (mismo almacén que los canales mock). */
export function listMessagesForEvent(
  channelName: string,
  eventName: string
): MockAblyInboundMessage[] {
  ensureStorageListener();
  return getBucket(channelName).messages.filter((m) => m.name === eventName);
}

function notify(channelName: string, msg: MockAblyInboundMessage) {
  const b = getBucket(channelName);
  b.listeners.forEach((fn) => fn(msg));
}

/** Simula mensajes entrantes desde otra pestaña (mismo origen). */
function onStorageChannel(e: StorageEvent) {
  if (!e.key?.startsWith(STORAGE_PREFIX) || !e.newValue) return;
  const channelName = e.key.slice(STORAGE_PREFIX.length);
  let incoming: MockAblyInboundMessage[] = [];
  try {
    incoming = JSON.parse(e.newValue) as MockAblyInboundMessage[];
  } catch {
    return;
  }
  const b = getBucket(channelName);
  const lastRemote = incoming[incoming.length - 1];
  const lastLocal = b.messages[b.messages.length - 1];
  if (
    lastRemote &&
    (!lastLocal || lastRemote.id !== lastLocal.id) &&
    b.messages.every((m) => m.id !== lastRemote.id)
  ) {
    b.messages = incoming;
    notify(channelName, lastRemote);
  }
}

let storageListenerAttached = false;

function ensureStorageListener() {
  if (storageListenerAttached || typeof window === 'undefined') return;
  storageListenerAttached = true;
  window.addEventListener('storage', onStorageChannel);
}

export type MockAblyChannel = {
  name: string;
  subscribe: (
    eventOrListener: string | MessageListener,
    listener?: MessageListener
  ) => void;
  unsubscribe: (
    eventOrListener: string | MessageListener,
    listener?: MessageListener
  ) => void;
  publish: (
    eventName: string,
    data: Record<string, unknown>,
    timestamp?: number
  ) => void;
  history: () => MockAblyInboundMessage[];
};

export type MockAblyRealtime = {
  connection: { state: MockAblyConnectionState };
  channels: { get: (name: string) => MockAblyChannel };
  close: () => void;
};

function createChannelApi(channelName: string): MockAblyChannel {
  ensureStorageListener();
  const b = getBucket(channelName);
  if (b.messages.length === 0) {
    b.messages = readStoredMessages(channelName);
  }

  return {
    name: channelName,
    subscribe(eventOrListener, listener?) {
      const cb =
        typeof eventOrListener === 'function' ? eventOrListener : listener;
      if (!cb) return;
      b.listeners.add(cb);
    },
    unsubscribe(eventOrListener, listener?) {
      const cb =
        typeof eventOrListener === 'function' ? eventOrListener : listener;
      if (!cb) return;
      b.listeners.delete(cb);
    },
    publish(
      eventName: string,
      data: Record<string, unknown>,
      timestamp?: number
    ) {
      const msg: MockAblyInboundMessage = {
        id: crypto.randomUUID(),
        name: eventName,
        data,
        timestamp: timestamp ?? Date.now(),
      };
      b.messages = [...b.messages, msg];
      writeStoredMessages(channelName, b.messages);
      notify(channelName, msg);
    },
    history: () => [...b.messages],
  };
}

/** Canal demo fijo patrocinador ↔ creador (sustituir por id de conversación real). */
export const DEFAULT_SPONSOR_CREATOR_CHANNEL = 'sponsor-creator:demo-thread';

/**
 * Crea un cliente tipo Ably Realtime (mock).
 * En producción reemplazar por `new Ably.Realtime({ key })` y el mismo nombre de canal.
 */
export function createMockAblyRealtime(): MockAblyRealtime {
  const channelCache = new Map<string, MockAblyChannel>();
  return {
    connection: { state: 'connected' },
    channels: {
      get(name: string) {
        let ch = channelCache.get(name);
        if (!ch) {
          ch = createChannelApi(name);
          channelCache.set(name, ch);
        }
        return ch;
      },
    },
    close: () => {
      channelCache.clear();
    },
  };
}
