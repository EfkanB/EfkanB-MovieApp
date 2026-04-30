import React, { useState } from 'react';
import './AdminPanel.css';

const AdminPanel = ({ token, username }) => {
  const [contentType, setContentType] = useState(''); // 'movie' or 'series'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    releaseYear: '',
    posterUrl: '',
    // Movie specific
    director: '',
    durationMinutes: '',
    // Series specific
    seasonCount: '',
    episodeCount: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Username': username
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = contentType === 'movie' ? '/api/admin/content/add-movie' : '/api/admin/content/add-series';
      const data = { ...formData };

      // Convert string numbers to numbers
      data.releaseYear = parseInt(data.releaseYear);
      if (contentType === 'movie') {
        data.durationMinutes = parseInt(data.durationMinutes);
      } else {
        data.seasonCount = parseInt(data.seasonCount);
        data.episodeCount = parseInt(data.episodeCount);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData || 'İçerik eklenirken bir hata oluştu');
      }

      const result = await response.json();
      setMessage(`${contentType === 'movie' ? 'Film' : 'Dizi'} başarıyla eklendi: ${result.title}`);

      // Form'u sıfırla
      setFormData({
        title: '',
        description: '',
        genre: '',
        releaseYear: '',
        posterUrl: '',
        director: '',
        durationMinutes: '',
        seasonCount: '',
        episodeCount: ''
      });
    } catch (error) {
      setMessage(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (!contentType) return null;

    return (
      <form onSubmit={handleSubmit} className="admin-form">
        <h3>{contentType === 'movie' ? 'Film Ekle' : 'Dizi Ekle'}</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Başlık *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="genre">Tür *</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              placeholder="Örn: Aksiyon, Dram, Bilim Kurgu"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="releaseYear">Çıkış Yılı *</label>
            <input
              type="number"
              id="releaseYear"
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleInputChange}
              min="1900"
              max="2030"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="posterUrl">Poster URL</label>
            <input
              type="url"
              id="posterUrl"
              name="posterUrl"
              value={formData.posterUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/poster.jpg"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Açıklama</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            placeholder="İçeriğin kısa açıklaması..."
          />
        </div>

        {contentType === 'movie' ? (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="director">Yönetmen *</label>
              <input
                type="text"
                id="director"
                name="director"
                value={formData.director}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="durationMinutes">Süre (dakika) *</label>
              <input
                type="number"
                id="durationMinutes"
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
          </div>
        ) : (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="seasonCount">Sezon Sayısı *</label>
              <input
                type="number"
                id="seasonCount"
                name="seasonCount"
                value={formData.seasonCount}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="episodeCount">Bölüm Sayısı *</label>
              <input
                type="number"
                id="episodeCount"
                name="episodeCount"
                value={formData.episodeCount}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Ekleniyor...' : `${contentType === 'movie' ? 'Film' : 'Dizi'} Ekle`}
        </button>
      </form>
    );
  };

  return (
    <section className="admin-panel">
      <h2>Admin Paneli - İçerik Yönetimi</h2>
      <p>Bu sayfa sadece <strong>ADMIN</strong> rolündeki kullanıcılar tarafından görülebilir.</p>

      <div className="content-type-selector">
        <h3>İçerik Türü Seçin</h3>
        <div className="type-buttons">
          <button
            type="button"
            className={`btn ${contentType === 'movie' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setContentType('movie')}
          >
            🎬 Film Ekle
          </button>
          <button
            type="button"
            className={`btn ${contentType === 'series' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setContentType('series')}
          >
            📺 Dizi Ekle
          </button>
        </div>
      </div>

      {renderForm()}

      {message && (
        <div className={`message ${message.includes('Hata') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="api-info">
        <h3>API Endpoint'leri</h3>
        <ul>
          <li><code>POST /api/admin/content/add-movie</code> - Film ekleme</li>
          <li><code>POST /api/admin/content/add-series</code> - Dizi ekleme</li>
          <li><code>PUT /api/contents/{'{id}'}</code> - İçerik güncelleme</li>
          <li><code>DELETE /api/contents/{'{id}'}</code> - İçerik silme</li>
        </ul>
      </div>
    </section>
  );
};

export default AdminPanel;
