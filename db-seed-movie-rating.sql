-- MovieApp DB Seed (Review tablosu üzerinden puan)
-- Not:
-- Bu proje şu an Review üzerinden ortalama hesaplıyor.
-- Aşağıdaki INSERT'ler review tablosu kolon adlarının entity ile uyumlu olduğunu varsayar:
-- rating (int), comment (varchar), created_at (datetime), user_id (FK), content_id (FK)
-- Eğer sizde kolon/tablolar farklıysa isimleri uyarlayın.

-- Film (content) ID 1: target avg ~ 4.5
-- Örnek: (5 + 4) / 2 = 4.5
INSERT INTO review (rating, comment, created_at, user_id, content_id)
VALUES
  (5, 'Mükemmel film, sonuna kadar akıyor!', NOW(), 1, 1),
  (4, 'Çok iyiydi, bazı sahneler biraz hızlıydı.', NOW(), 2, 1);

-- Film (content) ID 2: target avg ~ 3.8
-- Örnek: (4 + 3 + 4 + 3) / 4 = 3.5 (uymaz)
-- Hedef 3.8 için örnek: (5 + 4 + 4 + 3 + 4) / 5 = 4.0 (uymaz)
-- Hedef 3.8'e en yakın örnek: (4 + 4 + 3 + 4 + 3) / 5 = 3.6
-- Siz değerleri kesin istiyorsanız, kaç oyla tam 3.8 yapacağınıza göre ayarlayın.
-- Şimdilik 5 oy ile 3.8'e yakın: (4 + 4 + 4 + 3 + 2) / 5 = 3.4 (uymaz)
-- Bu nedenle: Lütfen kendi oy dağılımınıza göre düzenleyin.

-- Kullanılabilir örnek (avg = 3.8 tam):
-- 5 oy: toplam 19 puan gerekir (19/5=3.8) => (5,4,4,4,2) = 19
INSERT INTO review (rating, comment, created_at, user_id, content_id)
VALUES
  (5, 'Beklentimin üstündeydi.', NOW(), 1, 2),
  (4, 'Genel olarak çok iyi, tekrar izlenir.', NOW(), 2, 2),
  (4, 'Sürükleyiciydi, akıcılık yüksek.', NOW(), 3, 2),
  (4, 'Karakterler ve kurgu başarılı.', NOW(), 4, 2),
  (2, 'Bazı bölümler beni yordu.', NOW(), 5, 2);

