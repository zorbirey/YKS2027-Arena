# YKS2027 Arena — TYT Core V2 QA Raporu

## Parti özeti
- Parti: `tyt_core_v2_30.json`
- Yeni soru: **30**
- Önceki doğrulanmış soru: **20**
- Yeni toplam: **50**
- Durum: `verified-baseline`
- Kapsam tabanı: `MEB-TTKB-2026-YKS`
- Stil tabanı: `OSYM-2026-YKS`
- 2027 yeniden kapsam kontrolü: gerekli

## Dağılım
- Türkçe: 8
- Temel Matematik: 8
- Tarih: 2
- Coğrafya: 1
- Felsefe: 1
- Fizik: 3
- Kimya: 3
- Biyoloji: 4

## Teknik QA
- Soru sayısı: 30/30
- Benzersiz ID: 30/30
- Her soruda seçenek sayısı: 5/5
- `correctIndex` aralığı: tüm sorularda 0–4
- Boş soru kökü: 0
- Boş açıklama: 0
- Önceki V1 ID'leriyle çakışma: 0

## İçerik QA
- Her soruda tek doğru cevap kontrol edildi.
- Çeldiriciler ikinci doğru oluşturmayacak şekilde gözden geçirildi.
- Türkçe sorularında bağlam ve dil bilgisi cevabı yeniden okundu.
- Tarih/Coğrafya/Felsefe sorularında temel kavram ve tarihsel ilişki kontrol edildi.
- Fen sorularında temel tanım/ilke ve cevap eşleşmesi yeniden kontrol edildi.
- Sorular özgün yazıldı; çıkmış ÖSYM soru metni veya özgün senaryosu kopyalanmadı.

## Bağımsız sayısal ikinci kontrol
Aşağıdaki sonuçlar yeniden hesaplandı:
- Hareket problemi: 2,5 saat
- %25 kâr problemi: 400 TL maliyet
- Kümeler: 26 öğrenci
- Sayı basamakları: 63
- Üslü ifade: 16
- Aritmetik ortalama: 30
- Üçgen iç açısı: 70°
- Sayma: 12
- Fizik iş: 50 J
- Özkütle: 3 g/cm³
- Mol: 2 mol

## Yayın notu
Bu 50 soru henüz demo havuzuyla birleştirilmez. `data/verified/` altında tutulur. Protokole göre ikinci kontrol turundan sonra aktif soru havuzuna taşınabilir.
