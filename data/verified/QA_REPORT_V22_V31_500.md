# YKS2027 Arena — V22–V31 QA Raporu

## Özet

- Yeni soru: **500**
- Parti: **V22–V31** (10 × 50)
- TYT: **250**
- AYT: **250**
- Durum: `verified-baseline`
- Kapsam tabanı: `MEB-TTKB-2026-YKS`
- 2027 yeniden kontrol bayrağı: `needs2027Recheck: true`

## Teknik QA

- Soru sayısı: **500/500**
- Benzersiz ID: **500/500**
- Benzersiz soru kökü: **500/500**
- Her soruda tam 5 seçenek: **500/500**
- Her soruda 5 benzersiz seçenek: **500/500**
- `correctIndex` 0–4 aralığında: **500/500**
- TYT/AYT dağılımı: **250/250**
- Her alt parti: **25 TYT + 25 AYT = 50**

## Cevap kontrolü

- Sayısal/işlemsel soru bağımsız yeniden hesaplama: **310/310 doğru**
- Bilgi sorularında açıklama–doğru şık eşleşmesi: **140/140 doğru**
- Türkçe anlam/paragraf/yazım/noktalama şablon kontrolü: **50/50 doğru**
- Toplam cevap kontrolü: **500/500**

## Özgünlük ve kullanım

Sorular ÖSYM soru metinlerinden kopyalanmamıştır. ÖSYM yalnız test yapısı ve ölçme yaklaşımı için stil referansıdır. Bu havuz Arena iç kalite protokolüne göre doğrulanmış üretim havuzudur; MEB veya ÖSYM tarafından onaylanmış olduğu anlamına gelmez.

## Yayına alma

Dosya doğrulanmış havuzda tutulur. Canlı soru akışına alınmadan önce uygulama düzeyinde tekrar/çakışma kontrolü ve 2027 resmî konu-kazanım listesi yayımlandığında kapsam yeniden kontrolü yapılmalıdır.
