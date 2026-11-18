import React, { useEffect, useMemo, useState } from 'react';
import './AdminPanel.css';

import { adminApi } from '../services/adminApi';

const emptyMovie = {
  title: '',
  description: '',
  genre: '',
  releaseYear: '',
  posterUrl: '',
  director: '',
  durationMinutes: '',
};

const emptySeries = {
  title: '',
  description: '',
  genre: '',
  releaseYear: '',
  posterUrl: '',
  seasonCount: '',
  episodeCount: '',
};

const normalizeNumber = (v) => {
  if (v === '' || v === null || v === undefined) return '';
  const n = typeof v === 'string' ? Number(v) : v;
  return Number.isFinite(n) ? n : '';
};

const toSafeString = (v) => (v === null || v === undefined ? '' : String(v));

const AdminPanel = () => {
  const api = useMemo(() => adminApi, []);

  const [mode, setMode] = useState('movies'); // movies | series
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyMovie);

  const [message, setMessage] = useState('');
  const isAdminTokenPresent = Boolean(localStorage.getItem('authToken'));

  const refresh = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = mode === 'movies' ? await api.listMovies() : await api.listSeries();
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Admin endpointlerini gereksiz çağırmamak için
    if (!isAdminTokenPresent) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const startCreate = () => {
    setEditingId(null);
    setForm(mode === 'movies' ? { ...emptyMovie } : { ...emptySeries });
    setMessage('');
  };

  const startEdit = (item) => {
    setEditingId(item?.id ?? null);
    setMessage('');

    if (mode === 'movies') {
      setForm({
        title: toSafeString(item?.title),
        description: toSafeString(item?.description),
        genre: toSafeString(item?.genre),
        releaseYear: toSafeString(item?.releaseYear),
        posterUrl: toSafeString(item?.posterUrl),
        director: toSafeString(item?.director),
        durationMinutes: toSafeString(item?.durationMinutes),
      });
    } else {
      setForm({
        title: toSafeString(item?.title),
        description: toSafeString(item?.description),
        genre: toSafeString(item?.genre),
        releaseYear: toSafeString(item?.releaseYear),
        posterUrl: toSafeString(item?.posterUrl),
        seasonCount: toSafeString(item?.seasonCount),
        episodeCount: toSafeString(item?.episodeCount),
      });
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const requiredBase = ['title', 'genre', 'releaseYear'];
    for (const k of requiredBase) {
      if (!String(form[k]).trim()) return `${k} zorunludur.`;
    }

    if (mode === 'movies') {
      if (!String(form.director).trim()) return 'director zorunludur.';
      if (normalizeNumber(form.durationMinutes) === '') return 'durationMinutes zorunludur.';
    } else {
      if (normalizeNumber(form.seasonCount) === '') return 'seasonCount zorunludur.';
      if (normalizeNumber(form.episodeCount) === '') return 'episodeCount zorunludur.';
    }

    return '';
  };

  const buildPayload = () => {
    if (mode === 'movies') {
      return {
        title: form.title,
        description: form.description,
        genre: form.genre,
        releaseYear: normalizeNumber(form.releaseYear),
        posterUrl: form.posterUrl,
        director: form.director,
        durationMinutes: normalizeNumber(form.durationMinutes),
      };
    }

    return {
      title: form.title,
      description: form.description,
      genre: form.genre,
      releaseYear: normalizeNumber(form.releaseYear),
      posterUrl: form.posterUrl,
      seasonCount: normalizeNumber(form.seasonCount),
      episodeCount: normalizeNumber(form.episodeCount),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setMessage(`Hata: ${v}`);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const payload = buildPayload();

      if (!editingId) {
        const created = mode === 'movies' ? await api.createMovie(payload) : await api.createSeries(payload);
        setMessage(`${mode === 'movies' ? 'Film' : 'Dizi'} başarıyla eklendi: ${created?.title ?? ''}`.trim());
      } else {
        if (mode === 'movies') await api.updateMovie(editingId, payload);
        else await api.updateSeries(editingId, payload);
        setMessage(`${mode === 'movies' ? 'Film' : 'Dizi'} güncellendi.`);
      }

      setEditingId(null);
      startCreate();
      await refresh();
    } catch (err) {
      setMessage(`Hata: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm(`${mode === 'movies' ? 'Film' : 'Dizi'} silinsin mi? ID: ${id}`);
    if (!ok) return;

    setLoading(true);
    setMessage('');

    try {
      if (mode === 'movies') await api.deleteMovie(id);
      else await api.deleteSeries(id);
      setMessage('Silme başarılı.');
      await refresh();
    } catch (e) {
      setMessage(`Hata: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderNumberField = ({ name, label, min = '1' }) => (
    <div className="form-group">
      <label htmlFor={name}>{label} *</label>
      <input
        id={name}
        name={name}
        type="number"
        value={form[name]}
        onChange={onChange}
        required
        min={min}
      />
    </div>
  );

  return (
    <section className="admin-panel">
      <h2>Admin Paneli - İçerik Yönetimi</h2>
      <p>Bu sayfa yalnızca admin yetkisine sahip kullanıcılar için tasarlanmıştır.</p>

      <div className="content-type-selector">
        <h3>İçerik Türü</h3>
        <div className="type-buttons">
          <button
            type="button"
            className={`btn ${mode === 'movies' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              setMode('movies');
              setEditingId(null);
              setForm({ ...emptyMovie });
              setMessage('');
            }}
            disabled={loading}
          >
            🎬 Filmler
          </button>
          <button
            type="button"
            className={`btn ${mode === 'series' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              setMode('series');
              setEditingId(null);
              setForm({ ...emptySeries });
              setMessage('');
            }}
            disabled={loading}
          >
            📺 Diziler
          </button>
        </div>
      </div>

      {!isAdminTokenPresent && (
        <div className="message error" style={{ marginTop: '1rem' }}>
          Admin token bulunamadı. Lütfen giriş yapın.
        </div>
      )}

      {message && (
        <div className={`message ${message.toLowerCase().includes('hata') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="admin-toolbar" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
        <button type="button" className="btn btn-outline" onClick={startCreate} disabled={loading || !isAdminTokenPresent}>
          {editingId ? 'Yeni Ekle' : 'Ekle'}
        </button>
        <button type="button" className="btn btn-primary" onClick={refresh} disabled={loading || !isAdminTokenPresent}>
          {loading ? 'Yenileniyor...' : 'Listeyi Güncelle'}
        </button>
      </div>

      <div className="admin-table-wrapper" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid #eee' }}>ID</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid #eee' }}>Başlık</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid #eee' }}>Tür</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid #eee' }}>Yıl</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid #eee' }}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id}>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f3f3' }}>{item.id}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f3f3' }}>{item.title}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f3f3' }}>{item.genre}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f3f3' }}>{item.releaseYear}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f3f3', whiteSpace: 'nowrap' }}>
                  <button type="button" className="btn btn-outline" onClick={() => startEdit(item)} disabled={loading}>
                    Düzenle
                  </button>
                  <span style={{ display: 'inline-block', width: '0.5rem' }} />
                  <button type="button" className="btn btn-primary" onClick={() => handleDelete(item.id)} disabled={loading}>
                    Sil
                  </button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '1rem', color: '#666' }}>
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <h3>{editingId ? 'Güncelle' : 'Yeni Ekle'} - {mode === 'movies' ? 'Film' : 'Dizi'}</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Başlık *</label>
            <input id="title" name="title" value={form.title} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="genre">Tür *</label>
            <input id="genre" name="genre" value={form.genre} onChange={onChange} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="releaseYear">Çıkış Yılı *</label>
            <input
              id="releaseYear"
              name="releaseYear"
              type="number"
              value={form.releaseYear}
              onChange={onChange}
              required
              min="1900"
              max="2030"
            />
          </div>
          <div className="form-group">
            <label htmlFor="posterUrl">Poster URL</label>
            <input id="posterUrl" name="posterUrl" value={form.posterUrl} onChange={onChange} type="url" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Açıklama</label>
          <textarea id="description" name="description" value={form.description} onChange={onChange} rows={3} />
        </div>

        {mode === 'movies' ? (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="director">Yönetmen *</label>
                <input id="director" name="director" value={form.director} onChange={onChange} required />
              </div>
              {renderNumberField({ name: 'durationMinutes', label: 'Süre (dakika)' })}
            </div>
          </>
        ) : (
          <>
            <div className="form-row">
              {renderNumberField({ name: 'seasonCount', label: 'Sezon Sayısı' })}
              {renderNumberField({ name: 'episodeCount', label: 'Bölüm Sayısı' })}
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading || !isAdminTokenPresent}>
          {loading ? 'İşleniyor...' : editingId ? 'Güncelle' : 'Ekle'}
        </button>
      </form>
    </section>
  );
};

export default AdminPanel;

