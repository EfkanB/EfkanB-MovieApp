# MovieApp'i ücretsiz yayına alma (Render + Neon + Brevo)

Toplam maliyet: **0 $**. Üç ücretsiz hesap açacaksın. Şifreleri ve anahtarları **kimseyle paylaşma**; hepsini doğrudan Render paneline gireceksin.

| Parça | Servis | Ücretsiz plan |
|---|---|---|
| Uygulama | Render (web service) | 15 dk boşta kalınca uyur, ilk açılış ~30-60 sn |
| Veritabanı | Neon (PostgreSQL) | 1 GB, süresiz |
| Mail | Brevo (HTTP API) | Günde 300 mail |

> Render'ın ücretsiz planı SMTP (Gmail) portlarını engeller, ücretsiz veritabanını da 30 günde siler. Bu yüzden veritabanı Neon'da, mail Brevo'da.

---

## 1. Neon: veritabanı

1. https://neon.com adresinde hesap aç (GitHub ile girebilirsin).
2. **Create project** → bölge olarak **AWS Europe Central (Frankfurt)** seç (Render ile aynı bölge, daha hızlı).
3. Proje açılınca **Connect** düğmesine bas:
   - **Connection pooling** seçeneğini **kapat** (Hibernate havuzlanmış bağlantıyla sorun çıkarabilir).
   - Bağlantı adresi şuna benzer: `postgresql://KULLANICI:SIFRE@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`
4. Bu adresten üç değer çıkar:
   - `DB_URL` = `jdbc:postgresql://ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`
     (başına `jdbc:` ekle, `KULLANICI:SIFRE@` kısmını sil)
   - `DB_USERNAME` = `KULLANICI`
   - `DB_PASSWORD` = `SIFRE`

Tablolar uygulama ilk açıldığında otomatik oluşur, örnek filmler de eklenir.

## 2. Brevo: şifre sıfırlama maili

1. https://www.brevo.com adresinde ücretsiz hesap aç.
2. **Senders, Domains & Dedicated IPs → Senders** bölümünden gönderici e-posta adresini ekle ve gelen maildeki bağlantıyla doğrula.
   (Bunun için ayrı bir Gmail hesabı açabilirsin, örn. `movieapp.bildirim@gmail.com`.)
3. **SMTP & API → API Keys** bölümünden **Generate a new API key** → anahtarı kopyala.
   - `BREVO_API_KEY` = bu anahtar
   - `MAIL_FROM` = doğruladığın gönderici adresi

## 3. Render: uygulama

1. https://render.com adresinde GitHub hesabınla giriş yap.
2. **New → Blueprint** → `EfkanB-MovieApp` reposunu seç. Render, repodaki `render.yaml` dosyasını okur.
3. Senden şu değerleri ister; yukarıda topladıklarını gir:

   | Değişken | Değer |
   |---|---|
   | `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | Neon'dan (1. adım) |
   | `BREVO_API_KEY`, `MAIL_FROM` | Brevo'dan (2. adım) |
   | `CORS_ALLOWED_ORIGINS` | Sitenin adresi, örn. `https://movieapp.onrender.com` |
   | `FRONTEND_RESET_PASSWORD_URL` | Sitenin adresi + `/reset-password`, örn. `https://movieapp.onrender.com/reset-password` |

   `JWT_SECRET`'i Render kendisi rastgele üretir, dokunma.
   Sitenin adresini ilk kurulumda bilmiyorsan servis adını `movieapp` bırak; adres büyük ihtimalle `https://movieapp.onrender.com` olur. Ad alınmışsa Render başka bir adres verir; o zaman **Environment** sekmesinden son iki değeri düzeltip **Save** de.
4. **Apply** → ilk derleme 5-10 dakika sürer. Bittiğinde adres panelde görünür.

## 4. Admin hesabı

1. Sitede normal bir hesapla kayıt ol.
2. Neon panelinde **SQL Editor**'ü aç ve çalıştır:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE username = 'senin-kullanici-adin';
   ```
3. Siteden çıkış yapıp tekrar gir; menüde **İçerik Ekle** görünür.

> `db-seed-users-with-email.sql` dosyasını yayındaki veritabanında **çalıştırma** (şifresi 123456 olan bir admin açar).

## 5. Kontrol listesi

- [ ] Ana sayfa açılıyor, afişler görünüyor
- [ ] Kayıt ol / giriş yap çalışıyor
- [ ] Favoriye ekle, yorum yaz çalışıyor
- [ ] **Şifremi unuttum** → mail geliyor (spam klasörüne de bak) → bağlantı yeni şifre sayfasını açıyor
- [ ] Yanlış şifreyle 11 kez üst üste giriş denenince "Çok fazla deneme" uyarısı çıkıyor,
      ama **başka bir cihazdan** (örn. telefon, mobil veri) giriş hâlâ yapılabiliyor.
      Başka cihaz da engelleniyorsa Render'ın vekil sunucusu gerçek IP'yi iletmiyordur; bana haber ver.
- [ ] `frontend/src/siteConfig.js` içindeki `CONTACT_EMAIL`'e iletişim adresini yaz (gizlilik sayfasında görünür)

## Güncelleme

`main` dalına her push'ta Render siteyi otomatik yeniden derler ve yayınlar.

## Bilinen sınırlar

- Ücretsiz Render servisi boşta kalınca uyur; ilk ziyaretçi 30-60 saniye bekler.
- Neon da boşta kalınca uyur; ilk sorgu birkaç saniye gecikebilir.
- Günde 300'den fazla şifre sıfırlama maili gönderilemez.
