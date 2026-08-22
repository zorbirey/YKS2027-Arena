# YKS2027 Arena — Doğrulanmış Soru Havuzu Protokolü

Bu klasör demo sorularından ayrıdır. Buradaki kayıtlar üretim havuzudur; yalnız kalite kapısından geçen sorular canlı uygulamaya alınır.

## Kaynak tabanı

- MEB Talim ve Terbiye Kurulu: 2026 YKS'ye esas derslere ait konu ve kazanımlar (2027 resmî listesi yayımlanana kadar kapsam tabanı)
- ÖSYM: 2026 YKS TYT/AYT temel soru kitapçıkları ve cevap anahtarları (yalnız soru tarzı, test yapısı ve beceri seviyesi referansı)
- ÖSYM: 2026 YKS kılavuzundaki test kapsamları ve soru sayıları

ÖSYM soruları teliflidir. Havuzdaki sorular özgün yazılır; ÖSYM soru metni, özgün senaryosu veya ayırt edici seçenek yapısı kopyalanmaz.

## Eski durum alanları hakkında

Eski dosyalarda bulunan `verified`, `answerChecked: true` veya `distractorsChecked: true` alanları tek başına canlı-yayın onayı değildir. Özellikle factory ile üretilen V16–V301 kayıtları `generated-baseline` kabul edilir ve yeniden inceleme olmadan aktif havuza alınmaz.

## Bir sorunun aktif-havuz adayı olma şartları

1. Kapsam kontrolü: Konu YKS/MEB kapsam tabanıyla uyumlu olmalı.
2. Tek doğru cevap: Beş seçenek içinde yalnız bir seçenek tartışmasız doğru olmalı.
3. Çözüm kontrolü: Doğru cevaba kısa, denetlenebilir ve soru köküyle uyumlu gerekçe eklenmeli.
4. Çeldirici kontrolü: Dört yanlış seçenek makul olmalı ve farklı hata yollarını temsil etmeli; ikinci doğru oluşturmamalı.
5. Dil kontrolü: Soru kökü açık olmalı; gereksiz olumsuzluk, muğlaklık ve yapay bağlam bulunmamalı.
6. Özgünlük/semantik çeşitlilik: Yalnız sayı, kişi adı veya bağlam değiştirerek aynı çözüm yolu çoğaltılmamalı.
7. Teknik kontrol: ID benzersiz, tam 5 seçenekli ve `correctIndex` 0–4 aralığında olmalı.
8. Sayısal sorular: Sonuç üretim mantığından bağımsız ikinci hesapla doğrulanmalı.
9. Zorluk kalibrasyonu: Kolay/Orta/Zor etiketi soru içeriği ve bilişsel yük üzerinden atanmalı; teknik ID veya rastgele kurala dayanmamalı.
10. Kalite puanı: `CONTENT_REVIEW_RUBRIC_V1.md` üzerinden en az 10/12 alınmalı.
11. Semantik kota: `quality_gate_v2.js` normalize edilmiş aynı soru ailesinden en fazla 2 adayı ikinci tura bırakır.
12. İkinci içerik turu: `independentSemanticReview: true` olmadan `liveEligible: true` yazılamaz.

## Durum alanları

- `generated-baseline`: Yapısal üretimden geçmiş ancak bağımsız içerik incelemesi tamamlanmamış kayıt.
- `clean-reviewed-candidate`: İlk gerçek içerik/semantik incelemesini geçmiş, ikinci turu bekleyen kayıt.
- `liveEligible`: Tüm teknik, sayısal, semantik ve bağımsız içerik kontrollerini geçmiş kayıt.
- `scopeBaseline`: Şimdilik `MEB-TTKB-2026-YKS`; 2027 listesi yayımlandığında güncellenecek.
- `styleBaseline`: `OSYM-2026-YKS` yalnız stil ve beceri seviyesi referansıdır.
- `needs2027Recheck`: 2027 resmî kapsamı yayımlanana kadar `true`.

## Kalite temizliği politikası

- V16–V301 arasındaki 14.300 factory kaydı karantinadadır.
- Tam metin benzersizliği, semantik benzersizlik kabul edilmez.
- Doğrudan bilgi/tek işlem soruları yanlış biçimde Orta veya Zor etiketlenemez.
- Orta ve Zor sorularda yorum, ilişkilendirme, veri okuma veya çok adımlı işlem kanıtı aranır.
- Bilinen hatalar `quality_gate_v2.js` üzerinden düzeltilir veya karantinaya alınır.
- `CLEAN_POOL_MANIFEST_V2.json` temizleme ilerlemesinin tek kaynak durum dosyasıdır.

## Yayına alma kuralı

`data/verified/` altındaki hiçbir kayıt dosya adına veya eski `verified` alanına bakılarak doğrudan canlıya alınmaz. Yalnız `quality_gate_v2.js`, rubrik ve bağımsız ikinci içerik turunu geçen kayıtlar aktif havuza taşınır. Böylece demo, üretim ve gerçek temiz havuz birbirine karışmaz.
