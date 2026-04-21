import { useCallback, useState, type FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputBase,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import {
  addCreatorTierTemplate,
  deleteCreatorTierTemplate,
  listCreatorTierTemplates,
  updateCreatorTierTemplate,
  type CreatorTierTemplate,
} from '@/creators/lib/creatorTierTemplates';
import { formatUsdCompact } from '@/shared/lib/formatUsdCompact';
import { getMockSession } from '@/auth/lib/mockAuth';
import '@/creators/pages/CreatorTierTemplatesPage.css';
import '@/shared/styles/dashboard.css';

function emptyAddForm() {
  return { name: '', priceUsd: '', benefits: '' };
}

type BannerState = { tone: 'success' | 'error'; text: string } | null;

export default function CreatorTierTemplatesPage() {
  const session = getMockSession();
  const [templates, setTemplates] = useState<CreatorTierTemplate[]>(() => {
    const s = getMockSession();
    if (!s || s.role !== 'creator') return [];
    return listCreatorTierTemplates(s.id);
  });
  const [form, setForm] = useState(emptyAddForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [banner, setBanner] = useState<BannerState>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const refresh = useCallback(() => {
    if (!session || session.role !== 'creator') return;
    setTemplates(listCreatorTierTemplates(session.id));
  }, [session]);

  if (!session || session.role !== 'creator') return null;

  const startEdit = (t: CreatorTierTemplate) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      priceUsd: String(t.priceUsd),
      benefits: t.benefits.join(', '),
    });
    setBanner(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyAddForm());
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyAddForm());
    setBanner(null);
    setModalOpen(true);
  };

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBanner(null);
    const name = form.name.trim();
    const price = Number(form.priceUsd);
    if (!name) {
      setBanner({ tone: 'error', text: 'Enter a tier name.' });
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setBanner({ tone: 'error', text: 'Enter a valid price greater than zero.' });
      return;
    }
    const benefits = form.benefits
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);
    if (editingId) {
      const updated = updateCreatorTierTemplate(session.id, editingId, {
        name,
        priceUsd: price,
        benefits,
      });
      if (!updated) {
        setBanner({ tone: 'error', text: 'Could not update that tier.' });
        return;
      }
      refresh();
      closeModal();
      setBanner({ tone: 'success', text: 'Tier updated.' });
      return;
    }
    addCreatorTierTemplate(session.id, { name, priceUsd: price, benefits });
    refresh();
    closeModal();
    setBanner({ tone: 'success', text: 'Tier created.' });
  };

  const handleDelete = (id: string) => {
    deleteCreatorTierTemplate(session.id, id);
    if (editingId === id) closeModal();
    refresh();
    setBanner({ tone: 'success', text: 'Tier removed from library.' });
  };

  return (
    <Box component="main" className="dash-main tier-templates-page">
      <Box className="tier-templates-header">
        <Box>
          <Typography component="h1">My Tiers</Typography>
          <Typography component="p" className="tier-templates-lead">
            Save default sponsorship packages and reuse them across events.
          </Typography>
        </Box>
        <Button
          type="button"
          className="tier-templates-new-btn"
          onClick={openCreateModal}
          variant="contained"
          disableElevation
        >
          + New Tier
        </Button>
      </Box>

      {banner ? (
        <Alert
          className={`create-alert tier-templates-toast ${banner.tone === 'error' ? 'create-alert-error' : 'create-alert-success'
            }`}
        >
          {banner.text}
        </Alert>
      ) : null}

      <Box component="section" className="tier-templates-list-section">
        {templates.length === 0 ? (
          <Box className="tier-templates-empty">
            <Typography component="p" className="dash-events-empty">
              No tiers yet. Create your first default tier to reuse it in future events.
            </Typography>
          </Box>
        ) : (
          <Box component="ul" className="tier-templates-list">
            {templates.map((t) => (
              <li key={t.id} className="tier-templates-row">
                <Box className="tier-templates-row-actions">
                  <IconButton
                    type="button"
                    className="tier-templates-icon-btn"
                    onClick={() => startEdit(t)}
                    aria-label={`Edit ${t.name}`}
                    title="Edit tier"
                  >
                    <EditIcon fontSize="inherit" aria-hidden="true" />
                  </IconButton>
                  <IconButton
                    type="button"
                    className="tier-templates-icon-btn tier-templates-icon-btn-danger"
                    onClick={() => handleDelete(t.id)}
                    aria-label={`Delete ${t.name}`}
                    title="Delete tier"
                  >
                    <DeleteIcon fontSize="inherit" aria-hidden="true" />
                  </IconButton>
                </Box>
                <Typography component="h3" className="tier-templates-row-title">
                  {t.name}
                </Typography>
                <Box component="span" className="tier-templates-row-price">
                  {formatUsdCompact(t.priceUsd)}
                </Box>
                <Typography component="p" className="tier-templates-row-benefits">
                  {t.benefits.length > 0 ? t.benefits.join(', ') : 'No benefits added'}
                </Typography>
              </li>
            ))}
          </Box>
        )}
      </Box>

      {modalOpen ? (
        <Box className="tier-templates-modal-backdrop" role="presentation">
          <Box
            className="tier-templates-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tier-template-modal-title"
          >
            <Box className="tier-templates-modal-head">
              <Typography component="h2" id="tier-template-modal-title">
                {editingId ? 'Edit Default Tier' : 'New Default Tier'}
              </Typography>
              <IconButton
                type="button"
                className="tier-templates-modal-close"
                onClick={closeModal}
                aria-label="Close tier modal"
              >
                <CloseIcon fontSize="inherit" aria-hidden="true" />
              </IconButton>
            </Box>

            <Box component="form" className="tier-templates-modal-form" onSubmit={submitForm}>
              <Box className="create-field">
                <Typography component="label" className="create-field-label" htmlFor="tpl-name">
                  Tier Name
                </Typography>
                <InputBase
                  id="tpl-name"
                  type="text"
                  placeholder="e.g. Platinum"
                  value={form.name}
                  onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                  autoFocus
                />
              </Box>

              <Box className="create-field">
                <Typography component="label" className="create-field-label" htmlFor="tpl-price">
                  Price ($)
                </Typography>
                <Box className="tier-templates-price-wrap">
                  <Box component="span">$</Box>
                  <InputBase
                    id="tpl-price"
                    type="text"
                    inputMode="numeric"
                    placeholder="50000"
                    value={form.priceUsd}
                    onChange={(e) =>
                      setForm((current) => ({ ...current, priceUsd: e.target.value }))
                    }
                  />
                </Box>
              </Box>

              <Box className="create-field">
                <Typography component="label" className="create-field-label" htmlFor="tpl-benefits">
                  Benefits (comma-separated)
                </Typography>
                <InputBase
                  id="tpl-benefits"
                  type="text"
                  placeholder="Keynote slot, Premium booth, Logo..."
                  value={form.benefits}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, benefits: e.target.value }))
                  }
                />
              </Box>

              <Box className="tier-templates-modal-actions">
                <Button type="button" className="tier-templates-modal-cancel" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" className="tier-templates-primary-btn" variant="contained" disableElevation>
                  {editingId ? 'Save changes' : 'Create tier'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}
