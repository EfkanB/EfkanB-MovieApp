import React, { useState } from 'react';
import './AuthForm.css';

const AuthForm = ({ onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
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
    } catch (error) {
      setMessage('Sunucuya bağlanılamadı. Backend çalışıyor mu?');
    }
  };

  return (
    <section id="auth" className="auth-section">
      <div className="auth-card">
        <button type="button" className="auth-close" onClick={onClose}>
          ×
        </button>
        <h2>{mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Kullanıcı adı
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Şifre
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        {/* React artık burada çökmeyecek çünkü message kesinlikle bir string */}
        {message && <p className="auth-message">{message}</p>}
      </div>
    </section>
  );
};

export default AuthForm;