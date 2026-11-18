import { useEffect, useMemo, useState } from 'react';
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
  const n = typeof v === 'string' ? Number(v) : v;
  return Number.isFinite(n) ? n : v;
};

const AdminDashboard = ({ token }) => {
  const [mode, setMode] = useState('movies'); // movies | series

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyMovie);
  const [message, setMessage] = useState('');

  const api = useMemo(() => adminApi, []);

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
    // token yoksa admin erişimi denemesin
    if (!token) return undefined;
    let ignore = false;
    (mode === 'movies' ? api.listMovies() : api.listSeries())
      .then((data) => {
        if (!ignore) setList(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (!ignore) setMessage(e.message);
      });
    return () => {
      ignore = true;
    };
  }, [api, mode, token]);

  const startCreate = () => {
    setEditingId(null);
    setForm(mode === 'movies' ? { ...emptyMovie } : { ...emptySeries });
    setMessage('');
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setMessage('');

    if (mode === 'movies') {
      setForm({
        title: item.title ?? '',
        description: item.description ?? '',
        genre: item.genre ?? '',
        releaseYear: item.releaseYear ?? '',
        posterUrl: item.posterUrl ?? '',
        director: item.director ?? '',
        durationMinutes: item.durationMinutes ?? '',
      });
    } else {
      setForm({
        title: item.title ?? '',
        description: item.description ?? '',
        genre: item.genre ?? '',
        releaseYear: item.releaseYear ?? '',
        posterUrl: item.posterUrl ?? '',
        seasonCount: item.seasonCount ?? '',
        episodeCount: item.episodeCount ?? '',
      });
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        releaseYear: normalizeNumber(form.releaseYear),
        ...(mode === 'movies'
          ? { durationMinutes: normalizeNumber(form.durationMinutes), director: form.director }
          : { seasonCount: normalizeNumber(form.seasonCount), episodeCount: normalizeNumber(form.episodeCount) }),
      };

      if (!editingId) {
        const created = mode === 'movies' ? await api.createMovie(payload) : await api.createSeries(payload);
        setMessage(`${mode === 'movies' ? 'Film' : 'Dizi'} başarıyla eklendi: ${created?.title ?? ''}`);
      } else {
        await (mode === 'movies' ? api.updateMovie(editingId, payload) : api.updateSeries(editingId, payload));
        setMessage(`${mode === 'movies' ? 'Film' : 'Dizi'} güncellendi.`);
      }

      setEditingId(null);
      startCreate();
      await refresh();
    } catch (e2) {
      setMessage(e2.message);
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
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  const isError = message.toLowerCase().includes('hata') || message.toLowerCase().includes('başarısız');

  return (
    <section className="admin-panel page-width" aria-labelledby="admin-title">
      <div className="admin-head">
        <h2 id="admin-title">İçerik yönetimi</h2>
        <div className="segmented" role="tablist" aria-label="İçerik türü">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'movies'}
            className={mode === 'movies' ? 'is-active' : ''}
            onClick={() => setMode('movies')}
          >
            Filmler
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'series'}
            className={mode === 'series' ? 'is-active' : ''}
            onClick={() => setMode('series')}
          >
            Diziler
          </button>
        </div>
      </div>

      {message && (
        <div className={`message ${isError ? 'error' : 'success'}`} role={isError ? 'alert' : 'status'}>
          {message}
        </div>
      )}

      <div className="admin-layout">
        <div className="admin-card">
          <div className="admin-toolbar">
            <h3>{list.length} kayıt</h3>
            <div className="admin-toolbar__actions">
              <button type="button" className="btn btn-outline btn-small" onClick={refresh} disabled={loading || !token}>
                {loading ? 'Yenileniyor…' : 'Yenile'}
              </button>
              <button type="button" className="btn btn-dark btn-small" onClick={startCreate} disabled={loading}>
                Yeni ekle
              </button>
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Başlık</th>
                  <th scope="col">Tür</th>
                  <th scope="col">Yıl</th>
                  <th scope="col"><span className="visually-hidden">İşlemler</span></th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item.id} className={editingId === item.id ? 'is-editing' : ''}>
                    <td className="num">{item.id}</td>
                    <td className="title">{item.title}</td>
                    <td>{item.genre}</td>
                    <td className="num">{item.releaseYear}</td>
                    <td className="actions">
                      <button type="button" className="btn btn-ghost btn-small" onClick={() => startEdit(item)} disabled={loading}>
                        Düzenle
                      </button>
                      <button type="button" className="btn btn-small admin-delete" onClick={() => handleDelete(item.id)} disabled={loading}>
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty">
                      {loading ? 'Yükleniyor…' : 'Henüz kayıt yok. Sağdaki formdan ilk içeriği ekleyebilirsin.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <h3>{editingId ? 'İçeriği düzenle' : mode === 'movies' ? 'Yeni film' : 'Yeni dizi'}</h3>

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
              <div className="form-group">
                <label htmlFor="durationMinutes">Süre (dakika) *</label>
                <input
                  id="durationMinutes"
                  name="durationMinutes"
                  type="number"
                  value={form.durationMinutes}
                  onChange={onChange}
                  required
                  min="1"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="seasonCount">Sezon Sayısı *</label>
                <input
                  id="seasonCount"
                  name="seasonCount"
                  type="number"
                  value={form.seasonCount}
                  onChange={onChange}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label htmlFor="episodeCount">Bölüm Sayısı *</label>
                <input
                  id="episodeCount"
                  name="episodeCount"
                  type="number"
                  value={form.episodeCount}
                  onChange={onChange}
                  required
                  min="1"
                />
              </div>
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading || !token}>
          {loading ? 'Kaydediliyor…' : editingId ? 'Değişiklikleri kaydet' : 'Ekle'}
        </button>
      </form>
      </div>
    </section>
  );
};

export default AdminDashboard;

