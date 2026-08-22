# YKS2027 Arena — V13-R1 Yeniden Yazım QA

Tarih: 2026-08-22

## Kapsam
- Toplam: **50 soru**
- TYT: **25**
- AYT: **25**
- Format: **statik yeniden yazım**, factory kullanılmadı
- Durum: `rewrite-candidate`
- Kapsam tabanı: `MEB-TTKB-2026-YKS`
- Stil tabanı: `OSYM-2026-YKS`
- 2027 resmî konu/kazanım listesi yayımlandığında yeniden kapsam kontrolü gerekir.

## Yapısal QA
- Benzersiz ID: **50/50**
- Birebir benzersiz tam soru metni: **50/50**
- Her soruda tam 5 benzersiz seçenek: **50/50**
- `correctIndex` 0–4 aralığında: **50/50**
- Boş olmayan açıklama: **50/50**
- Doğru cevap konum dağılımı: **0:10, 1:10, 2:10, 3:10, 4:10**
- Zorluk dağılımı: **30 Orta, 20 Zor**

## İçerik yaklaşımı
V13-R1, eski şablon-ağırlıklı V13 kaydının yerine aday olmak üzere yeniden yazıldı. Yalnız sayı veya bağlam değiştiren soru ailesi çoğaltımı kullanılmadı. TYT Türkçe bölümünde paragraf, çıkarım ve sözel mantık; TYT Matematikte çok adımlı yüzde, işçi, olasılık, veri, karışım ve kümeler; AYT Matematik/Fen tarafında fonksiyon, türev, integral, kombinasyon, momentum, denge, gazlar, kalıtım ve deney/veri yorumlama ağırlığı artırıldı.

## Bağımsız sayısal ikinci kontrol
Üretim metninden ayrı hesapla **28 sayısal/işlemsel soru** yeniden çözüldü.

- Yeniden hesaplanan: **28**
- Doğru cevapla eşleşen: **28/28**
- Hata: **0**

Kontrol edilen başlıca alanlar: ardışık yüzde, birlikte iş yapma, kombinasyonlu olasılık, kalan koşulları, benzerlik, ağırlıklı ortalama, kümeler, yaş, karışım, iş-enerji, seyreltme, paralel direnç, bileşke fonksiyon, parametreli ikinci derece denklem, trigonometri, logaritma, integral, aritmetik dizi, analitik geometri, kombinasyon, kalan teoremi, düşey hareket, seri-paralel direnç, dalga, momentum, pH seyreltme, ideal gaz oranı ve bağımsız dağılım.

## Yayın kararı
Bu paket ilk kalite turunu geçen **yeniden yazım adayıdır**. Henüz canlı havuza alınmaz. Canlıya geçiş için `CONTENT_REVIEW_RUBRIC_V1.md` üzerinden en az **10/12**, semantik aile kotası ve ikinci bağımsız içerik incelemesi (`independentSemanticReview: true`) gerekir.

Bu rapordaki “kontrol” ifadesi MEB veya ÖSYM soru bazlı onayı anlamına gelmez; Arena iç kalite protokolünü ifade eder.
