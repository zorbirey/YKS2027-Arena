# YKS2027 Arena — QA Report V142–V301

Tarih: 2026-08-22

## Kapsam
- Yeni soru sayısı: 8.000
- Parti aralığı: V142–V301
- Parti sayısı: 160
- Her parti: 50 soru
- Dağılım: 4.000 TYT + 4.000 AYT
- Durum: `verified-baseline`
- Kapsam tabanı: `MEB-TTKB-2026-YKS`
- Stil tabanı: `OSYM-2026-YKS`
- 2027 resmî konu/kazanım listesi yayımlandığında yeniden kapsam kontrolü gerekir.

## Yapısal QA
Üretim dosyası Node.js altında çalıştırılarak oluşan gerçek soru nesneleri üzerinde kontrol edildi.

- Toplam soru: 8.000 / 8.000
- TYT: 4.000 / 4.000
- AYT: 4.000 / 4.000
- Benzersiz ID: 8.000 / 8.000
- Birebir benzersiz tam soru metni: 8.000 / 8.000
- Tam 5 seçenek ve seçenekler kendi içinde benzersiz: 8.000 / 8.000
- `correctIndex` 0–4 aralığında: 8.000 / 8.000
- Boş olmayan kısa açıklama: 8.000 / 8.000
- Parti metadata sayısı: 160 / 160

## Bağımsız sayısal kontrol
Üretim mantığından ayrı bir Python doğrulayıcı ile sayısal/işlemsel sorular yeniden hesaplandı.

- Yeniden hesaplanan soru: 4.480
- Doğru cevapla eşleşen: 4.480 / 4.480
- Hata: 0

Kontrol edilen başlıca türler: denklem, yüzde, oran-orantı, hareket, sayı problemleri, geometri, örüntü, kümeler, ortalama, olasılık, kuvvet-hareket, Ohm bağıntısı, mol-kütle, yoğunluk, türev, ikinci derece denklem kök toplamı, aritmetik dizi, logaritma, özel açı trigonometrisi, alan, fonksiyon değeri, belirli integral ve ideal gaz mol-hacim hesabı.

## Not
`verified-baseline` ifadesi MEB veya ÖSYM tarafından tek tek onaylanmış soru anlamına gelmez. Arena iç kalite protokolünde, resmî kapsam tabanı ve beş seçenek/tek doğru/çeldirici/çözüm kontrollerinden geçirilmiş üretim durumunu ifade eder.
