# YKS2027 Arena — QA Raporu — Mixed Core V4

## Parti özeti

- Dosya: `mixed_core_v4_50.json`
- Toplam soru: 50
- TYT: 20
- AYT: 30
- Seçenek sayısı: Her soruda 5
- Doğru cevap: Her soruda tek cevap
- Özgünlük: ÖSYM soru metni kopyalanmadan özgün üretim
- Kapsam tabanı: MEB-TTKB 2026 YKS; 2027 resmî kapsam yayımlandığında yeniden kontrol edilecek

## Teknik kontrol

- 50/50 benzersiz ID
- 50/50 tam 5 seçenek
- 50/50 `correctIndex` değeri 0-4 aralığında
- 50/50 açıklama alanı dolu
- 50/50 sınav ve ders etiketi mevcut
- Batch özel `V4-` ID önekiyle önceki partilerle çakışma riski kaldırıldı

## İçerik kontrolü

- Soru kökleri tek anlamlılık açısından yeniden okundu.
- Çeldiriciler ikinci bir doğru cevap oluşturmaması açısından kontrol edildi.
- Türkçe sorularında dil ve anlam kontrolü yapıldı.
- Tarih, coğrafya, felsefe, din, edebiyat ve fen sorularında temel kavram ve olgu eşleşmeleri yeniden kontrol edildi.
- 19 sayısal/işlemsel soru bağımsız ikinci işlem kontrolünden geçti.

## Sayısal ikinci kontrol örnekleri

- TYT Mutlak Değer: çözümler 8 ve -2, toplam 6.
- TYT Oran-Orantı: 25 litrelik 2:3 karışımda meyve suyu 15 litre.
- TYT Denklem: 3(x-4)=x+2 için x=7.
- TYT Yaş problemi: kız 8 yaşında.
- TYT Fizik iş: 10 N × 4 m = 40 J.
- AYT bileşke fonksiyon: g(f(2))=25.
- AYT polinom kalan: P(1)=4.
- AYT logaritma: log₂32=5.
- AYT dizi: a₆=19.
- AYT dalga hızı: 5 Hz × 2 m = 10 m/s.
- AYT frekans: 1/0,25=4 Hz.
- AYT kalıtım: Ss × ss için çekinik fenotip olasılığı 1/2.

## Sonuç

Parti `verified-baseline` statüsünde kabul edildi. 2027 resmî konu-kazanım listesi yayımlandığında kapsam alanı yeniden taranacaktır. Canlı üretim havuzuna alınmadan önce mevcut protokol gereği ikinci yayın kontrolü uygulanmalıdır.
