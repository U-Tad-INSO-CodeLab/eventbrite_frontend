const STORAGE_KEY = 'eventlink_creator_tier_templates';

export type CreatorTierTemplate = {
  id: string;
  creatorId: string;
  name: string;
  priceUsd: number;
  benefits: string[];
  updatedAt: string;
};

type Store = Record<string, CreatorTierTemplate[]>;

function readStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Store;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store: Store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function normalizeBenefits(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((b) => String(b).trim()).filter(Boolean);
}

function normalizeTemplate(
  creatorId: string,
  partial: Partial<CreatorTierTemplate> & { id?: string }
): CreatorTierTemplate {
  const now = new Date().toISOString();
  const price =
    typeof partial.priceUsd === 'number' && Number.isFinite(partial.priceUsd)
      ? Math.max(0, Math.floor(partial.priceUsd))
      : 0;
  return {
    id: typeof partial.id === 'string' && partial.id.length > 0 ? partial.id : crypto.randomUUID(),
    creatorId,
    name: String(partial.name ?? '').trim(),
    priceUsd: price,
    benefits: normalizeBenefits(partial.benefits),
    updatedAt: typeof partial.updatedAt === 'string' ? partial.updatedAt : now,
  };
}

export function listCreatorTierTemplates(creatorId: string): CreatorTierTemplate[] {
  const list = readStore()[creatorId];
  if (!Array.isArray(list)) return [];
  return list
    .map((t) => normalizeTemplate(creatorId, t))
    .filter((t) => t.name.length > 0)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function addCreatorTierTemplate(
  creatorId: string,
  input: { name: string; priceUsd: number; benefits: string[] }
): CreatorTierTemplate {
  const store = readStore();
  const list = Array.isArray(store[creatorId]) ? [...store[creatorId]] : [];
  const created = normalizeTemplate(creatorId, {
    ...input,
    updatedAt: new Date().toISOString(),
  });
  list.push(created);
  store[creatorId] = list;
  writeStore(store);
  return created;
}

export function updateCreatorTierTemplate(
  creatorId: string,
  templateId: string,
  input: { name: string; priceUsd: number; benefits: string[] }
): CreatorTierTemplate | null {
  const store = readStore();
  const list = Array.isArray(store[creatorId]) ? store[creatorId] : [];
  const idx = list.findIndex((t) => t.id === templateId);
  if (idx === -1) return null;
  const next = normalizeTemplate(creatorId, {
    ...list[idx],
    ...input,
    id: templateId,
    updatedAt: new Date().toISOString(),
  });
  const copy = [...list];
  copy[idx] = next;
  store[creatorId] = copy;
  writeStore(store);
  return next;
}

export function deleteCreatorTierTemplate(creatorId: string, templateId: string): void {
  const store = readStore();
  const list = Array.isArray(store[creatorId]) ? store[creatorId] : [];
  store[creatorId] = list.filter((t) => t.id !== templateId);
  writeStore(store);
}

export type DraftTierRow = {
  id: string;
  name: string;
  priceUsd: string;
  benefits: string;
};

export function draftTierFromTemplate(template: CreatorTierTemplate): DraftTierRow {
  return {
    id: crypto.randomUUID(),
    name: template.name,
    priceUsd: String(template.priceUsd),
    benefits: template.benefits.join(', '),
  };
}

export function isPlaceholderDraftTier(tier: DraftTierRow): boolean {
  if (tier.name.trim().length > 0) return false;
  const price = Number(tier.priceUsd);
  const hasValidPrice =
    tier.priceUsd.trim() !== '' && Number.isFinite(price) && price > 0;
  return !hasValidPrice;
}

function normalizeDraftBenefits(benefits: string): string[] {
  return benefits
    .split(',')
    .map((benefit) => benefit.trim())
    .filter(Boolean);
}

export function tierDraftMatchesTemplate(
  tier: DraftTierRow,
  template: Pick<CreatorTierTemplate, 'name' | 'priceUsd' | 'benefits'>
): boolean {
  const tierName = tier.name.trim();
  const tierPrice = Number(tier.priceUsd);
  if (!tierName || !Number.isFinite(tierPrice) || tierPrice <= 0) return false;

  const draftBenefits = normalizeDraftBenefits(tier.benefits);
  if (draftBenefits.length !== template.benefits.length) return false;

  return (
    tierName === template.name.trim() &&
    Math.floor(tierPrice) === Math.floor(template.priceUsd) &&
    draftBenefits.every((benefit, index) => benefit === template.benefits[index])
  );
}
