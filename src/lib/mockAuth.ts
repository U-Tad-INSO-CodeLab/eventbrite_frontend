/**
 * Autenticación simulada para desarrollo frontend.
 * Los datos viven en localStorage; no hay backend.
 * Contraseñas en texto plano solo para demo — nunca en producción.
 */

export type MockUserRole = 'sponsor' | 'creator';

export type MockSessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: MockUserRole;
};

type StoredUser = MockSessionUser & { password: string };

const STORAGE_USERS = 'eventlink_mock_users';

/** Clave compartida sessionStorage + localStorage (recordarme) */
export const MOCK_SESSION_KEY = 'eventlink_mock_session';

/** Mensaje único post-registro (evita depender de location.state) */
export const MOCK_LOGIN_FLASH_KEY = 'eventlink_login_flash';

const DEMO_PASSWORD = 'demo1234';
const DEMO_SPONSOR_EMAIL = 'demo-sponsor@eventlink.com';
const DEMO_CREATOR_EMAIL = 'demo-creator@eventlink.com';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS);
    if (!raw) {
      const seed: StoredUser[] = [
        {
          id: 'seed-sponsor',
          email: DEMO_SPONSOR_EMAIL,
          password: DEMO_PASSWORD,
          fullName: 'Sponsor demo',
          role: 'sponsor',
        },
        {
          id: 'seed-creator',
          email: DEMO_CREATOR_EMAIL,
          password: DEMO_PASSWORD,
          fullName: 'Creator demo',
          role: 'creator',
        },
      ];
      localStorage.setItem(STORAGE_USERS, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw) as Array<
      Omit<StoredUser, 'role'> & { role?: MockUserRole }
    >;
    let changed = false;
    const users: StoredUser[] = parsed.map((u) => {
      const role: MockUserRole =
        u.role === 'creator' || u.role === 'sponsor' ? u.role : 'sponsor';
      if (u.role !== role) changed = true;
      return { ...u, role };
    });
    if (changed) writeUsers(users);
    return users;
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

function parseSession(raw: string | null): MockSessionUser | null {
  if (!raw) return null;
  try {
    const u = JSON.parse(raw) as Partial<MockSessionUser>;
    if (!u.id || !u.email || typeof u.fullName !== 'string') return null;
    const role: MockUserRole =
      u.role === 'creator' || u.role === 'sponsor' ? u.role : 'sponsor';
    return {
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      role,
    };
  } catch {
    return null;
  }
}

export function getMockSession(): MockSessionUser | null {
  const fromSession = parseSession(sessionStorage.getItem(MOCK_SESSION_KEY));
  if (fromSession) return fromSession;
  return null;
}

export function clearMockSession() {
  sessionStorage.removeItem(MOCK_SESSION_KEY);
}

function persistSession(user: MockSessionUser, remember: boolean) {
  sessionStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user));
  if (remember) {
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(MOCK_SESSION_KEY);
  }
}

/** Restaura sesión "recordarme" al cargar la app */
export function hydrateSessionFromRememberMe() {
  if (parseSession(sessionStorage.getItem(MOCK_SESSION_KEY))) return;
  const user = parseSession(localStorage.getItem(MOCK_SESSION_KEY));
  if (!user) {
    localStorage.removeItem(MOCK_SESSION_KEY);
    return;
  }
  const payload = JSON.stringify(user);
  sessionStorage.setItem(MOCK_SESSION_KEY, payload);
  localStorage.setItem(MOCK_SESSION_KEY, payload);
}

export function getHomePathForRole(role: MockUserRole): string {
  return role === 'creator' ? '/creator' : '/sponsor';
}

export type LoginResult =
  | { ok: true; user: MockSessionUser }
  | { ok: false; error: string };

export async function mockLogin(
  email: string,
  password: string,
  remember: boolean
): Promise<LoginResult> {
  await delay(450);
  const users = readUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (!found || found.password !== password) {
    return { ok: false, error: 'Email o contraseña incorrectos.' };
  }
  const user: MockSessionUser = {
    id: found.id,
    email: found.email,
    fullName: found.fullName,
    role: found.role,
  };
  persistSession(user, remember);
  return { ok: true, user };
}

export type RegisterResult = { ok: true } | { ok: false; error: string };

export async function mockRegister(
  fullName: string,
  email: string,
  password: string,
  role: MockUserRole
): Promise<RegisterResult> {
  await delay(550);
  const users = readUsers();
  const normalized = email.trim().toLowerCase();
  if (users.some((u) => u.email.toLowerCase() === normalized)) {
    return { ok: false, error: 'Ya existe una cuenta con ese email.' };
  }
  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    email: email.trim(),
    password,
    fullName: fullName.trim(),
    role,
  };
  users.push(newUser);
  writeUsers(users);
  return { ok: true };
}

export const MOCK_AUTH_HINT = `Demo sponsor: ${DEMO_SPONSOR_EMAIL} · Demo creator: ${DEMO_CREATOR_EMAIL} · Contraseña: ${DEMO_PASSWORD}`;
