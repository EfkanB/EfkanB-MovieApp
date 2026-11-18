import React from 'react';
import './Features.css';

const Features = () => {
  return (
    <section id="features">
      <div className="row">
        <div className="col-2 features__left"></div>
        <div className="col-2 features__right">
          <h3>Sinema Dünyasını Keşfet, Puanla ve İncele!</h3>
          <p>İzlediğiniz filmleri kaydedin, favori listelerinizi oluşturun ve diğer kullanıcıların yorumlarını okuyarak sıradaki filminizi bulun. Gelişmiş puanlama sistemimizle topluluğumuzun bir parçası olun.</p>
          <a
            className="btn btn-secondary"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert('Bu özellik çok yakında eklenecektir!');
            }}
          >
            Özellikleri Keşfet
          </a>

        </div>
      </div>
    </section>
  );
};

export default Features;