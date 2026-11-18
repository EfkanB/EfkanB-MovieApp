import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <section id="how-it-works">
      <div className="row">
        <h2 className="section-title">Nasıl çalışır?</h2>
        <p>Favori film ve dizilerinizi izlemeye başlamak için adım adım şimdi rehberlik edeceğiz!</p>
      </div>

      <div className="row">
        <div className="icon-box col-3">
          <i className="fas fa-sign-in-alt fa-3x"></i>
          <h3>Kayıt Ol</h3>
          <p>Saniyeler içinde hesabınızı oluşturun. Aramıza katılıp kendi sinema profilinizi yaratmaya hemen başlayın.</p>
        </div>

        <div className="icon-box col-3">
          <i className="fab fa-buffer fa-3x"></i>
          <h3>Plan Seç</h3>
          <p>İhtiyacınıza en uygun abonelik modelini belirleyin. Ücretsiz sürümle keşfe çıkın veya Premium avantajlarla film deneyiminizi kişiselleştirin.</p>
        </div>

        <div className="icon-box col-3">
          <i className="far fa-smile fa-3x"></i>
          <h3>Keşfet ve Puanla</h3>
          <p>Kapsamlı veritabanımızdaki binlerce filmi inceleyin. İzlediğiniz yapımlara puan verin, yorumlarınızı paylaşın ve izleme listenizi oluşturun.</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

