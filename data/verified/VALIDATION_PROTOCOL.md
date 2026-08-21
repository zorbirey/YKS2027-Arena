# YKS2027 Arena — Doğrulanmış Soru Havuzu Protokolü

Bu klasör demo sorularından ayrıdır. Buradaki sorular ancak kalite kontrolünden geçtikten sonra canlı uygulama havuzuna alınır.

## Kaynak tabanı

- MEB Talim ve Terbiye Kurulu: 2026 YKS'ye esas derslere ait konu ve kazanımlar (2027 resmî listesi yayımlanana kadar kapsam tabanı)
- ÖSYM: 2026 YKS TYT/AYT temel soru kitapçıkları ve cevap anahtarları (yalnız soru tarzı, test yapısı ve beceri seviyesi referansı)
- ÖSYM: 2026 YKS kılavuzundaki test kapsamları ve soru sayıları

ÖSYM soruları teliflidir. Havuzdaki sorular özgün yazılır; ÖSYM soru metni, şık yapısı veya özgün senaryosu kopyalanmaz.

## Bir sorunun VERIFIED olma şartları

1. Kapsam kontrolü: Konu resmî YKS/MEB kapsamıyla uyumlu olmalı.
2. Tek doğru cevap: Beş seçenek içinde yalnız bir seçenek tartışmasız doğru olmalı.
3. Çözüm kontrolü: Doğru cevaba kısa ve denetlenebilir gerekçe eklenmeli.
4. Çeldirici kontrolü: Yanlış seçenekler makul ama yanlış olmalı; ikinci bir doğruya dönüşmemeli.
5. Dil kontrolü: Soru kökü açık olmalı; gereksiz olumsuzluk ve muğlak ifade bulunmamalı.
6. Özgünlük kontrolü: Çıkmış ÖSYM sorusu kopyalanmamalı.
7. Teknik kontrol: ID benzersiz, 5 seçenekli ve correctIndex 0-4 aralığında olmalı.
8. Sayısal sorular: Hesap sonucu ikinci kez bağımsız olarak doğrulanmalı.

## Durum alanları

- `verified`: İçerik ve cevap kontrolünden geçti.
- `scopeBaseline`: Şimdilik `MEB-TTKB-2026-YKS`; 2027 listesi yayımlandığında güncellenecek.
- `styleBaseline`: `OSYM-2026-YKS`.
- `original`: Her zaman `true` olmalı.
- `needs2027Recheck`: 2027 resmî kapsamı yayımlanana kadar `true`.

## Yayına alma kuralı

`data/verified/` altındaki soru doğrudan canlı uygulamada kullanılmaz. En az iki kontrol turundan sonra aktif havuza taşınır. Böylece demo soruları ile doğrulanmış üretim havuzu birbirine karışmaz.
