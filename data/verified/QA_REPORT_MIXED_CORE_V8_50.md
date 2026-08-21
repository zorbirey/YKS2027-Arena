# YKS2027 Arena — V8 50 Soru QA Raporu

## Parti
- TYT: 25 soru (`mixed_core_v8_tyt25.json`)
- AYT: 25 soru (`mixed_core_v8_ayt25.json`)
- Toplam: 50 soru

## Yapısal kontrol
- 50/50 soruda benzersiz ID doğrulandı.
- 50/50 soruda tam 5 seçenek doğrulandı.
- Tüm `correctIndex` değerleri 0-4 aralığında.
- Her soruda kısa çözüm/gerekçe bulunuyor.
- Soru metinleri özgün üretildi; çıkmış ÖSYM soru metni kopyalanmadı.

## Cevap ve işlem kontrolü
- Tüm sorular tek doğru cevap açısından kontrol edildi.
- 21 sayısal/işlemsel soru bağımsız ikinci hesap turundan geçti.
- Matematik kontrolleri: oran-orantı, yüzde, yaş, bölünebilme, mutlak değer, fonksiyon, geometri, istatistik, polinom, ters fonksiyon, trigonometri, logaritma, türev, integral ve dizi.
- Fizik kontrolleri: hareket, basınç, Newton yasaları, momentum ve Ohm yasası.
- Kimya pH hesabı ayrıca doğrulandı.

## Kapsam
2027 resmî konu-kazanım listesi yayımlanana kadar `MEB-TTKB-2026-YKS` kapsam tabanı kullanılmaktadır. Bu nedenle kayıtlar `needs2027Recheck: true` durumundadır.

## Sonuç
V8 parti durumu: **verified-baseline**.
