# YKS2027 Arena — V12-R1 Yeniden Yazım QA

Tarih: 2026-08-22

## Kapsam
- Toplam: **50**
- TYT: **25**
- AYT: **25**
- Üretim biçimi: **statik, tek tek yazılmış soru seti**
- Factory/parametre çoğaltma: **kullanılmadı**
- Durum: `rewrite-candidate`
- Canlı havuz: **hayır**

## Yapısal QA
- Benzersiz ID: **50/50**
- Birebir benzersiz soru metni: **50/50**
- Her soruda 5 benzersiz seçenek: **50/50**
- `correctIndex` 0–4 aralığında: **50/50**
- TYT/AYT dağılımı: **25/25**
- Doğru seçenek konumu dağılımı: **0:10, 1:10, 2:10, 3:10, 4:10**

## Sayısal ikinci kontrol
Toplam **25** sayısal/işlemsel soru ayrı hesap kontrolünden geçirildi ve seçili doğru seçenekle eşleşti.

Kontrol edilen başlıca türler:
- TYT: ardışık yüzde, karışım, ortalama hız, üç kümede birleşim, basamak problemi, alan-çevre, olasılık, ortalama, Newton yasası, elektrik enerjisi, yüzde derişim, monohibrit çaprazlama
- AYT: bileşke fonksiyon, kökler-katsayılar, logaritmik denklem, trigonometrik denklem, türev, belirli integral, aritmetik dizi, permütasyon, enerji korunumu, seri devre, momentum, dalga bağıntısı, sınırlayıcı bileşen

## İçerik dağılımı
### TYT
- Türkçe: 5
- Temel Matematik: 8
- Tarih: 2
- Coğrafya: 2
- Fizik: 2
- Kimya: 2
- Biyoloji: 2
- Felsefe: 1
- Din Kültürü: 1

### AYT
- Matematik: 8
- Fizik: 4
- Kimya: 3
- Biyoloji: 3
- Türk Dili ve Edebiyatı: 3
- Tarih: 2
- Coğrafya: 2

## Zorluk
- Orta: 43
- Zor: 7

`Zor` etiketi yalnız daha fazla koşul, alan bilgisi bağlantısı veya birden fazla çözüm adımı gerektiren sorulara verildi. Bu etiket yine de ikinci içerik turunda yeniden kalibre edilecektir.

## Kalite ilkeleri
- Sadece sayı/kişi/bağlam değiştirerek eski soru çoğaltılmadı.
- Türkçe sorularında paragraf, cümle yerleştirme, sözel mantık ve anlam ilişkisi kullanıldı.
- Matematikte yalnız tek formül ezberi yerine denklem kurma, çoklu koşul ve modelleme artırıldı.
- Fen sorularında deney, süreç, denge ve kavram ilişkisi soruları kullanıldı.
- Sosyal/edebiyat sorularında salt tarih/eser adı ezberine ek olarak bağlam ve çıkarım soruları kullanıldı.

## Yayın kararı
Bu set **ilk yeniden yazım ve teknik/cevap kontrolünden geçmiştir**, ancak `independentSemanticReview=false` ve `liveEligible=false` olarak kalır.

Canlı havuza geçiş için:
1. İkinci bağımsız içerik turu,
2. 10/12 veya üzeri rubrik puanı,
3. Semantik aile kotası kontrolü,
4. 2027 resmî kapsamı yayımlandığında kapsam yeniden kontrolü
zorunludur.
