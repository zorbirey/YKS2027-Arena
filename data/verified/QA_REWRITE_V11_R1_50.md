# YKS2027 Arena — V11-R1 Yeniden Yazım QA

Tarih: 2026-08-22

## Kapsam
- Yeniden yazılan soru: **50**
- TYT: **25**
- AYT: **25**
- Dosyalar: `rewrite_v11_r1_part1_10.json` … `rewrite_v11_r1_part5_10.json`
- Durum: `rewrite-candidate`
- Factory üretimi: **hayır**

## Yapısal kontrol
- 50/50 benzersiz ID
- Her soruda tam 5 benzersiz seçenek
- Tüm `correctIndex` değerleri 0–4 aralığında
- Doğru seçenek konum dağılımı: 0=10, 1=10, 2=10, 3=10, 4=10
- TYT/AYT dağılımı: 25/25
- Boş soru/açıklama yok

## İçerik iyileştirmeleri
- TYT Türkçede paragraf, çıkarım, cümle yerleştirme ve dil bilgisi dengesi artırıldı.
- TYT Matematikte tek işlem yerine çok adımlı problem, oran, kümeler, parçalı hareket ve alan-çevre ilişkileri eklendi.
- Fen sorularında açık fiziksel nicelik, deney yorumu ve süreç ilişkisi kullanıldı.
- AYT Matematikte fonksiyon, ikinci derece, türev, integral, trigonometri, dizi, analitik geometri ve limit ayrı çözüm yollarıyla ele alındı.
- AYT Fizik ve Kimyada önceki belirsiz şablonlardan kaçınıldı; nicelikler ve koşullar açık yazıldı.
- Doğru cevap konumu dengelendi; sabit seçenek indeksi örüntüsü kaldırıldı.

## Sayısal ikinci kontrol
Toplam **25 sayısal/işlemsel soru** bağımsız hesapla yeniden kontrol edildi ve doğru seçenekle eşleşti.

## Zorluk dağılımı
- Kolay: 2
- Orta: 40
- Zor: 8

Bu dağılım önceki V11'e göre daha fazla muhakeme ve zor soru içerir; ancak gerçek sınav kalibrasyonu olarak kabul edilmez. İkinci içerik turunda gerekirse yeniden etiketlenecektir.

## Yayın kararı
**CANLIYA HAZIR DEĞİL.**

Bu paket yalnız yeniden yazım aday havuzudur. Canlı havuza geçiş için:
1. `CONTENT_REVIEW_RUBRIC_V1.md` üzerinden soru bazında en az 10/12,
2. ikinci bağımsız semantik/içerik kontrolü,
3. sayısal sorularda ikinci hesap kontrolü,
4. semantik aile kotası
şartları birlikte sağlanmalıdır.
