# YKS2027 Arena — QA Rewrite V14–V23 R1 (500)

Tarih: 2026-08-22

## Kapsam
- Yeni statik kalite adayı: **500**
- TYT: **250**
- AYT: **250**
- Paketler: **V14-R1–V23-R1** (10 × 50)
- Runtime factory kullanılmadı.
- Durum: `rewrite-candidate`

## Yapısal QA
- Toplam kayıt: **500/500**
- Benzersiz ID: **500/500**
- Benzersiz tam soru metni: **500/500**
- Tam 5 benzersiz seçenek: **500/500**
- Geçerli `correctIndex`: **500/500**
- Doğru cevap konumu dağılımı: 0=100, 1=100, 2=100, 3=100, 4=100
- Her paket: 25 TYT + 25 AYT

## Semantik çeşitlilik kontrolü
- Tanımlı semantik aile: **250**
- Aile başına en fazla varyant: **2**
- Sayı veya kısa bağlam değişikliği tek başına yeni aile sayılmadı.
- Normalize edilmiş basit semantik parmak izi taramasında aile kotası >2 bulunmadı.

## Sayısal ikinci kontrol
- Sayısal/işlemsel aday: **240**
- Ayrı hesaplayıcı ile yeniden hesaplanan: **240**
- Eşleşen: **240/240**
- Hatalı sonuç: **0**

Kontrol; TYT matematik/geometri, fizik, kimya ve sayısal coğrafya ile AYT matematik, fizik, kimya ve kalıtım olasılıklarını kapsar.

## Zorluk dağılımı
- Kolay: **36**
- Orta: **424**
- Zor: **40**

Bu dağılım nihai ÖSYM güçlük kalibrasyonu değildir. İkinci içerik turunda gerçek çözüm süresi, adım sayısı ve çeldirici gücü tekrar değerlendirilecektir.

## İçerik statüsü
Bu 500 soru eski factory kayıtlarının yerine doğrudan `verified` ilan edilmemiştir. `rewrite-candidate` olarak tutulur. Aktif havuza geçiş için ayrıca:
1. bağımsız semantik/içerik incelemesi,
2. en az 10/12 içerik rubriği,
3. 2027 resmî kapsamı yayımlandığında konu-kazanım yeniden kontrolü gerekir.

`independentSemanticReview=false` ve `liveEligible=false` korunur.
