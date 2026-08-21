# YKS2027 Arena — V16–V21 / 300 Soru QA Raporu

Tarih: 2026-08-22

## Kapsam

- Yeni soru: 300
- TYT: 150
- AYT: 150
- Parti: V16, V17, V18, V19, V20, V21
- Her parti: 50 soru (25 TYT + 25 AYT)
- Dosya: `mixed_core_v16_v21_factory.js`
- Format: deterministic-factory-v2

## Otomatik yapısal kontrol

- Toplam soru: 300/300
- Benzersiz ID: 300/300
- Benzersiz soru kökü: 300/300
- Her soruda tam 5 seçenek: PASS
- `correctIndex` aralığı 0–4: PASS
- Parti başına soru sayısı: 50/50
- Toplam TYT/AYT dağılımı: 150/150

## Bağımsız hesap kontrolü

Factory çıktısı ayrı JSON olarak genişletildi ve ikinci bir Python doğrulayıcıyla formül tabanlı sorular yeniden hesaplandı.

- Bağımsız yeniden hesaplanan soru: 96
- Hatalı sonuç: 0
- Sonuç: 96/96 PASS

Kontrol edilen başlıca alanlar: denklem, yüzde, hareket, geometri, harita ölçeği, fonksiyon, polinom, dizi, türev, integral, logaritma, permütasyon ve kombinasyon.

## Doğrulama statüsü

`verified-baseline` Arena iç kalite protokolünü ifade eder; MEB veya ÖSYM tarafından onay verildiği anlamına gelmez. 2027 resmî konu-kazanım listesi yayımlanana kadar `MEB-TTKB-2026-YKS` kapsam tabanı kullanılmaktadır ve bütün kayıtlar `needs2027Recheck: true` durumundadır.

Bu üretim havuzu canlı uygulamaya doğrudan alınmaz; yayın öncesi ikinci içerik kontrolü kuralı devam eder.
