import React, { useState } from 'react';

const ForgotPassword = ({ onClose }) => {
  

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || 'Bir hata oluştu');
      }

      window.alert(data?.message || 'Şifre sıfırlama bağlantısı e-postanıza gönderildi');
      onClose?.();
    } catch (err) {
      setMessage(err.message || 'Sunucu hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="auth" className="auth-section">
      <div className="auth-card">
        <button type="button" className="auth-close" onClick={onClose}>
          ×
        </button>
        <h2>Şifremi Unuttum</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            E-posta
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}
      </div>
    </section>
  );
};

export default ForgotPassword;

