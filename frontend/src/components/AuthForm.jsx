import { useState } from 'react';
import { X } from 'lucide-react';
import './AuthForm.css';

import ForgotPassword from './ForgotPassword';

const AuthForm = ({ onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (event) => {

    event.preventDefault();
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
            body: JSON.stringify({
              username,
              password,
              ...(mode === 'register' ? { email } : {}),
            }),

      });

      const data = await response.json();
      
      if (response.ok) {
        const providedUsername = data.username || username;
        const userRole = data.role || 'USER';
        onAuthSuccess(providedUsername, data.token, userRole);
        return;
      } else {
        // DÜZELTİLEN KISIM: Gelen veri obje olsa bile sadece metin (string) almasını sağladık
        if (typeof data === 'string') {
          setMessage(data);
        } else if (data?.message) {
          setMessage(data.message);
        } else if (data?.error) {
          setMessage(`Hata: ${data.error}`);
        } else {
          setMessage('Bağlantı hatası veya yetkisiz işlem.');
        }
      }
    } catch {
      setMessage('Sunucuya bağlanılamadı. Backend çalışıyor mu?');
    }
  };

  if (showForgot) {
    return <ForgotPassword onClose={() => setShowForgot(false)} />;
  }

  return (
    <section id="auth" className="auth-section">
      <div className="auth-card">
        <button type="button" className="auth-close" onClick={onClose} aria-label="Kapat">
          <X size={20} />
        </button>
        <h2>{mode === 'login' ? 'Tekrar hoş geldin' : 'Hesap oluştur'}</h2>
        <p className="auth-lead">
          {mode === 'login'
            ? 'Favorilerine ve izleme listene kaldığın yerden devam et.'
            : 'Puan ver, yorum yaz, listelerini oluştur.'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Kullanıcı adı
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          {mode === 'register' && (
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
          )}
          <label>
            Şifre
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={mode === 'register' ? 8 : undefined}
              required
            />
          </label>

          <button type="submit" className="btn btn-primary">
            {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>
        <p className="auth-toggle">
          {mode === 'login' ? 'Hesabın yok mu?' : 'Zaten hesabın var mı?'}{' '}
          <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Kayıt Ol' : 'Giriş Yap'}
          </button>
        </p>

        {mode === 'login' && (
          <p className="auth-toggle">
            <button type="button" onClick={() => setShowForgot(true)}>
              Şifremi unuttum
            </button>
          </p>
        )}

        {message && <p className="auth-message" role="alert">{message}</p>}
      </div>
    </section>
  );
};

export default AuthForm;