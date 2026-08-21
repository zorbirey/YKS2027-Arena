# YKS2027 Arena — QA Report V62–V101

Tarih: 2026-08-22

## Kapsam
- Yeni soru sayısı: 2.000
- Parti aralığı: V62–V101
- Dağılım: 1.000 TYT + 1.000 AYT
- Statü: `verified-baseline`
- Kapsam tabanı: `MEB-TTKB-2026-YKS`
- Stil tabanı: `OSYM-2026-YKS`
- 2027 resmî konu-kazanım listesi yayımlandığında yeniden kapsam kontrolü zorunludur.

## Otomatik/yapısal QA
- 2.000 / 2.000 soru üretildi.
- 2.000 / 2.000 benzersiz ID.
- Yeni V62–V101 serisi içinde 2.000 / 2.000 benzersiz soru kökü.
- Her soruda tam 5 seçenek.
- Her soruda 5 benzersiz seçenek.
- Tüm `correctIndex` değerleri 0–4 aralığında.
- Her partide tam 50 soru.
- Her partide dağılım 25 TYT + 25 AYT.
- Toplam dağılım 1.000 TYT + 1.000 AYT.

## Sayısal ikinci kontrol
Yeni seride `numericSecondCheck=true` işaretli 1.080 soru, üretim kodundan bağımsız ikinci hesaplama betiğiyle yeniden hesaplandı.

Sonuç: **1.080 / 1.080 eşleşme**.

Kontrol edilen başlıca türler:
- TYT denklem, yüzde, hareket, geometri, olasılık
- TYT fizik kuvvet ve kimya mol hesapları
- AYT fonksiyon, türev, logaritma, diziler
- AYT fizik işlem soruları
- AYT kimya mol hesapları

## Yayın notu
Bu rapordaki “doğrulandı” ifadesi YKS2027 Arena iç kalite protokolünü ifade eder; MEB veya ÖSYM tarafından tek tek onay verilmiş olduğu anlamına gelmez. Soru kökleri özgün üretimdir; ÖSYM soruları kopyalanmamıştır.

Sonuç: V62–V101 serisi `verified-baseline` havuzuna kabul edildi.