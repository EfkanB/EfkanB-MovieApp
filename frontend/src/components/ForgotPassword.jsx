import { useState } from 'react';
import { X } from 'lucide-react';

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
        <button type="button" className="auth-close" onClick={onClose} aria-label="Kapat">
          <X size={20} />
        </button>
        <h2>Şifreni mi unuttun?</h2>
        <p className="auth-lead">E-posta adresini yaz, sana şifre sıfırlama bağlantısı gönderelim.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            E-posta
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Gönderiliyor…' : 'Sıfırlama bağlantısı gönder'}
          </button>
        </form>

        {message && <p className="auth-message" role="status">{message}</p>}
      </div>
    </section>
  );
};

export default ForgotPassword;

