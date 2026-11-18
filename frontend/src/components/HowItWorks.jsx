import './HowItWorks.css';

const STEPS = [
  {
    title: 'Kayıt ol',
    text: 'Saniyeler içinde hesabınızı oluşturun. Aramıza katılıp kendi sinema profilinizi yaratmaya hemen başlayın.',
  },
  {
    title: 'Plan seç',
    text: 'İhtiyacınıza en uygun abonelik modelini belirleyin. Ücretsiz sürümle keşfe çıkın veya Premium avantajlarla film deneyiminizi kişiselleştirin.',
  },
  {
    title: 'Keşfet ve puanla',
    text: 'Kapsamlı veritabanımızdaki filmleri inceleyin. İzlediğiniz yapımlara puan verin, yorumlarınızı paylaşın ve izleme listenizi oluşturun.',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="how page-width" aria-labelledby="how-title">
      <div className="section-head how__head">
        <h2 id="how-title">Nasıl çalışır?</h2>
        <p>Favori film ve dizilerinizi takip etmeye üç adımda başlayın.</p>
      </div>

      <ol className="how__steps">
        {STEPS.map((step, index) => (
          <li key={step.title} className="how__step">
            <span className="how__num" aria-hidden="true">{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default HowItWorks;
