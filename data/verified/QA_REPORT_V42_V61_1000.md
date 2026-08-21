# YKS2027 Arena — QA Report V42–V61

Tarih: 2026-08-22

## Kapsam
- Yeni soru sayısı: **1000**
- TYT: **500**
- AYT: **500**
- Partiler: **V42–V61** (20 × 50)
- Durum: `verified-baseline`
- Kapsam tabanı: `MEB-TTKB-2026-YKS`
- Stil tabanı: `OSYM-2026-YKS`
- `needs2027Recheck: true`

## Otomatik yapısal QA
- Toplam üretim: **1000/1000**
- Benzersiz ID: **1000/1000**
- Benzersiz soru kökü: **1000/1000**
- Tam 5 benzersiz seçenek: **1000/1000**
- Geçerli `correctIndex` (0–4): **1000/1000**
- Her parti: **25 TYT + 25 AYT = 50 soru**

## Bağımsız sayısal ikinci kontrol
Aşağıdaki sayısal/işlemsel gruplar üretim mantığından bağımsız ikinci hesapla yeniden kontrol edildi:
- TYT Matematik: 200
- TYT Fizik/Kimya sayısal: 60
- AYT Matematik: 200
- AYT Fizik/Kimya sayısal: 60
- AYT Kalıtım olasılıkları: 20

Toplam bağımsız ikinci hesap: **540/540 doğru**.

## İçerik ilkeleri
- Sorular Arena için özgün üretilmiştir; ÖSYM soruları kopyalanmamıştır.
- Doğru cevap ve kısa açıklama her kayıtta tutulur.
- Çeldiriciler beş seçenekli yapı içinde tek doğru cevabı koruyacak şekilde üretilir.
- “Doğrulanmış” ifadesi MEB/ÖSYM onayı anlamına gelmez; Arena iç kalite protokolündeki `verified-baseline` seviyesini ifade eder.
- 2027 resmî konu/kazanım listesi yayımlandığında kapsam yeniden kontrol edilmelidir.

## Sonuç
V42–V61 partisi **verified-baseline** havuzuna kabul edildi. Canlı üretim havuzuna alınmadan önce proje yayın protokolündeki ek kontrol turu uygulanmalıdır.
