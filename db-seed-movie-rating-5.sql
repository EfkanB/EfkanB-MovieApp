-- MovieApp DB Seed (Review tablosu üzerinden puan)
-- 5 farklı film/dizi için örnek yorum + rating ekler.
-- Not:
-- Bu dosya MySQL içindir.
-- Kolon adlarının entity ile uyumlu olduğunu varsayar:
--   review: (id PK otomatik), rating, comment, created_at, user_id, content_id
--   users ve content tablosunda ilgili id’lerin var olması gerekir.
-- Eğer user_id/content_id değerleriniz farklıysa bu script’i uyarlayın.

-- Öneri user_id seti: 1,2,3,4,5 (kendi DB’nize göre değiştirin)
-- Öneri content_id seti: 1..5 (kendi DB’nize göre değiştirin)

INSERT INTO review (rating, comment, created_at, user_id, content_id)
VALUES
  (5, 'Harika bir film, kesinlikle izleyin!', NOW(), 1, 1),
  (4, 'Kurgusu çok başarılıydı, tempoyu hiç düşürmüyor.', NOW(), 2, 1),

  (3, 'Orta seviye ama yine de keyifliydi.', NOW(), 3, 2),
  (4, 'Güzel oyunculuklar ve akıcı bir senaryo.', NOW(), 4, 2),

  (5, 'Aşırı beğendim, tekrar izlerim.', NOW(), 5, 3),
  (4, 'Sürükleyici ve etkileyiciydi.', NOW(), 1, 3),

  (2, 'Beklentimin altında kaldı.', NOW(), 2, 4),
  (3, 'Bazı bölümler güzeldi ama genel olarak zayıf.', NOW(), 3, 4),

  (4, 'Duygusu ve mesajı kuvvetliydi.', NOW(), 4, 5),
  (5, 'Çok tatmin oldum, sonu da harikaydı.', NOW(), 5, 5);

