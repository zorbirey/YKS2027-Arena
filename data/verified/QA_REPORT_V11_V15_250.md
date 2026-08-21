# YKS2027 Arena — QA Report V11–V15

Tarih: 2026-08-22

## Kapsam

- Yeni soru: **250**
- TYT: **125**
- AYT: **125**
- Partiler: V11, V12, V13, V14, V15
- Her parti: 50 soru = 25 TYT + 25 AYT

## Teknik doğrulama

- 250/250 benzersiz yeni ID
- 250/250 soru tam 5 seçenekli
- 250/250 `correctIndex` değeri 0–4 aralığında
- Yeni 250 soru içinde birebir yinelenen soru metni: 0
- Aynı soruda yinelenen seçenek: 0
- Her soruda kısa çözüm/açıklama mevcut
- Sorular özgün üretimdir; çıkmış ÖSYM soru metinleri kopyalanmamıştır

## Sayısal ikinci kontrol

TYT Temel Matematik ve AYT Matematikteki toplam **80 soru**, soru kökündeki verilerden bağımsız formül/parsing kontrolüyle yeniden hesaplandı.

- Yeniden hesaplanan: 80
- Doğru sonuç: 80
- Hatalı sonuç: 0

Kontrol edilen başlıklar arasında denklem, yüzde, oran-orantı, hareket, ortalama, olasılık, Pisagor, kümeler, ikinci derece denklemler, fonksiyon, logaritma, türev, integral, diziler, analitik geometri ve trigonometri bulunmaktadır.

## Ders dağılımı

### TYT — 125
- Temel Matematik: 40
- Türkçe: 35
- Tarih: 10
- Coğrafya: 8
- Fizik: 8
- Kimya: 8
- Biyoloji: 9
- Felsefe: 4
- Din Kültürü: 3

### AYT — 125
- Matematik: 40
- Fizik: 20
- Kimya: 15
- Biyoloji: 15
- Türk Dili ve Edebiyatı: 20
- Tarih: 10
- Coğrafya: 5

## Kapsam notu

2027 resmî YKS konu/kazanım listesi yayımlanana kadar `MEB-TTKB-2026-YKS` kapsamı baz alınmaktadır. Bu nedenle V11–V15 kayıtlarında `needs2027Recheck: true` korunmuştur. `verified` ifadesi Arena iç kalite protokolünü ifade eder; MEB veya ÖSYM onayı anlamına gelmez.
