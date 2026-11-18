import './Plans.css';

const Plans = () => {
  const showSoon = () => {
    alert('Bu özellik çok yakında eklenecektir!');
  };

  return (
    <section id="plans">
      <div className="row">
        <h2 className="section-title">Fiyatlandırma</h2>

        <div className="container clearfix">
          <div className="plan">
            <div className="inner-plan">
              <h2>Ücretsiz (0$)</h2>
              <h3>0/ay</h3>
              <ul className="plan__features">
                <li>Sınırsız keşif</li>
                <li>1-5 yıldız puanlama</li>
                <li>Standart yorum yapma</li>
                <li>Temel izleme listesi</li>
                <li>Reklamlı arayüz</li>
              </ul>
              <div>
                <button className="btn btn-primary" onClick={showSoon}>Hemen Başla</button>
              </div>

            </div>
          </div>
          <div className="plan plan--featured">
            <div className="inner-plan recommended_plan">
              <h2 className="plan__badge">Recommended</h2>
              <h2>Temel (9.99$ - Önerilen)</h2>
              <h3>9,99$/ay</h3>
              <ul className="plan__features">
                <li>Reklamsız arayüz</li>
                <li>Sınırsız favori listesi</li>
                <li>Gelişmiş filtreleme</li>
                <li>“Sinemasever” rozeti</li>
              </ul>
              <div>
                <button className="btn btn-primary" onClick={showSoon}>Planı Seç</button>
              </div>

            </div>
          </div>
          <div className="plan">
            <div className="inner-plan">
              <h2>Premium (19.99$)</h2>
              <h3>19,99$/ay</h3>
              <ul className="plan__features">
                <li>Reklamsız arayüz</li>
                <li>Detaylı izleme istatistikleri</li>
                <li>“Premium Eleştirmen” rozeti</li>
                <li>Yeni özelliklere erken erişim</li>
              </ul>
              <div>
                <button className="btn btn-primary" onClick={showSoon}>Planı Seç</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Plans;