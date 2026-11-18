import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || 'Şifre sıfırlanamadı');
      }

      window.alert(data?.message || 'Şifre başarıyla sıfırlandı');
      window.location.reload();
    } catch (err) {
      setMessage(err.message || 'Sunucu hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="auth" className="auth-section">
      <div className="auth-card">
        <h2>Yeni Şifre Belirle</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Yeni Şifre
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="btn btn-primary" disabled={loading || !token}>
            {loading ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
          </button>
        </form>

        {!token && <p className="auth-message">Token bulunamadı.</p>}
        {message && <p className="auth-message">{message}</p>}
      </div>
    </section>
  );
};

export default ResetPassword;

