# QA REPORT — V32–V41 / 500 Soru

Tarih: 2026-08-22

## Kapsam
- Toplam yeni soru: 500
- TYT: 250
- AYT: 250
- Partiler: V32, V33, V34, V35, V36, V37, V38, V39, V40, V41
- Durum: `verified-baseline`
- Kapsam tabanı: `MEB-TTKB-2026-YKS`
- Stil tabanı: `OSYM-2026-YKS`
- 2027 resmî konu-kazanım listesi yayımlandığında yeniden kapsam kontrolü gerekir.

## Yapısal QA
- 500/500 benzersiz ID
- 500/500 benzersiz soru kökü
- 500/500 soruda tam 5 seçenek
- Tüm seçenek kümelerinde 5 benzersiz seçenek
- 500/500 geçerli `correctIndex` (0–4)
- 500/500 açıklama alanı mevcut
- Dağılım: 250 TYT + 250 AYT
- 10 parti × 50 soru

## İkinci hesap kontrolü
Bağımsız ikinci kontrolde 250 sayısal/formül sorusu tekrar hesaplandı ve 250/250 doğru cevapla eşleşti. Kontrol edilen başlıca türler:
- TYT denklem, yüzde, oran-orantı, hareket, kümeler, olasılık, geometri, ortalama, yaş ve sayı soruları
- AYT ikinci derece denklemler, fonksiyon, diziler, logaritma, türev, integral, kombinasyon, trigonometri, polinom ve limit
- Fizik iş, momentum ve dalga hızı
- Kimya mol ve çözelti derişimi

## Yayın notu
Bu rapordaki “doğrulanmış” ifadesi Arena iç kalite protokolüne göre `verified-baseline` durumunu belirtir. MEB veya ÖSYM tarafından soru bazında onay verildiği anlamına gelmez. Canlı havuza alınmadan önce yayın kontrolü ve 2027 resmî kapsam yeniden kontrolü uygulanmalıdır.
