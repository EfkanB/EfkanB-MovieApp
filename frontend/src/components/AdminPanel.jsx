import React from 'react';

const AdminPanel = ({ token, username }) => {
  return (
    <section className="admin-panel">
      <h2>Admin Paneli</h2>
      <p>Bu sayfa sadece <strong>ADMIN</strong> rolündeki kullanıcılar tarafından görülebilir.</p>
      <p>API üzerinden içerik ekleme ve yönetme yetkisine sahipsiniz.</p>
      <div>
        <ul>
          <li><code>POST /api/admin/movies</code> - Film ekleme</li>
          <li><code>POST /api/admin/series</code> - Dizi ekleme</li>
          <li><code>PUT /api/contents/{'{id}'}</code> - İçerik güncelleme</li>
          <li><code>DELETE /api/contents/{'{id}'}</code> - İçerik silme</li>
        </ul>
      </div>
      <p>Yeni içerik eklemek için <strong>ADMIN</strong> rolü ile giriş yapmış olmanız yeterlidir.</p>
      <p>Eğer yetkiniz yoksa, lütfen admin hesabı ile tekrar giriş yapın.</p>
    </section>
  );
};

export default AdminPanel;
