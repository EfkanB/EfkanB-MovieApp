import { CONTACT_EMAIL } from '../siteConfig';
import './Privacy.css';

// Uygulamanın gerçekte sakladığı verileri anlatan sade gizlilik sayfası (KVKK aydınlatma).
const Privacy = () => {
  return (
    <article className="privacy page-width" aria-labelledby="privacy-title">
      <h1 id="privacy-title">Gizlilik ve kişisel veriler</h1>
      <p className="privacy__lead">
        MovieApp'i kullanırken hangi bilgilerinin saklandığını ve neden saklandığını burada bulabilirsin.
      </p>

      <h2>Hangi verileri saklıyoruz?</h2>
      <ul>
        <li><strong>Kullanıcı adı ve e-posta adresi:</strong> hesabını oluşturmak ve şifreni unuttuğunda sıfırlama bağlantısı göndermek için.</li>
        <li><strong>Şifre:</strong> düz metin olarak değil, geri çevrilemeyen bir özet (BCrypt) olarak saklanır. Şifreni biz de göremeyiz.</li>
        <li><strong>Favorilerin, izleme listen, puanların ve yorumların:</strong> uygulamanın temel işlevleri için. Yorumların diğer kullanıcılara kullanıcı adınla birlikte görünür; e-posta adresin hiçbir zaman gösterilmez.</li>
      </ul>

      <h2>Tarayıcında ne tutulur?</h2>
      <p>
        Giriş yaptığında oturum anahtarın tarayıcının yerel depolamasında (localStorage) tutulur. Reklam ya da
        takip amaçlı çerez kullanmıyoruz.
      </p>

      <h2>Verilerin kimlerle paylaşılır?</h2>
      <p>
        Verilerin satılmaz ve reklam için kullanılmaz. Uygulamanın çalışması için şu hizmet sağlayıcıları kullanılır:
        sunucu (Render), veritabanı (Neon) ve şifre sıfırlama e-postaları (Brevo). Bu sağlayıcıların sunucuları
        yurt dışında olabilir. Film afişleri TMDB'den yüklenir.
      </p>

      <h2>Haklarını nasıl kullanırsın?</h2>
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında verilerine erişme, düzeltilmesini veya
        silinmesini isteme hakkın var.
        {CONTACT_EMAIL ? (
          <>
            {' '}Bunun için <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> adresine yazabilirsin.
          </>
        ) : null}
      </p>

      <p className="privacy__back">
        <a href="/">Ana sayfaya dön</a>
      </p>
    </article>
  );
};

export default Privacy;
