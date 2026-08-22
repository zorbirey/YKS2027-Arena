# YKS2027 Arena — Kalite Düzeltme Turu 01

Tarih: 2026-08-22

## Amaç

15.000 teknik üretim kaydını sayı hedefinden kalite hedefinə geçirmek; hatalı şablonları düzeltmek, semantik tekrarları karantinaya almak ve aktif havuz için gerçek bir içerik geçiş standardı kurmak.

## Bu turda yapılanlar

### 1. Sistematik hata düzeltme kuralları

`quality_gate_v1.js` eklendi.

- V42–V61: 20 AYT Kimya denge kaydı yeniden yazım kuralına alındı. Soru kökü, sabit sıcaklıkta denge sabiti K'nın tek doğru olması için netleştirildi.
- V62–V101: 160 AYT Fizik kaydı yeniden yazım kuralına alındı. Tanımsız iki sayıyı çarpma biçimindeki zayıf şablonlar; Dinamik, İş-Enerji, Kinetik Enerji ve Momentum sorularına dönüştürüldü.
- V102–V141: 2.000 kaydın ID uzunluğundan üretilen zorluk etiketi kaldırılıp içerik/konu temelli kuralla yeniden atanıyor.
- V142–V301: 160 AYT Matematik kaydındaki yanlış `Analitik Geometri` etiketi `Dörtgenler ve Alan` olarak düzeltiliyor.

Toplam sistematik düzeltme kuralı kapsamı: **2.340 kayıt**.

### 2. Factory kayıtlarının kalite sınıfı

V16–V301 arasındaki 14.300 factory kaydı, ikinci bağımsız içerik turu tamamlanmadan `verified` kabul edilmiyor. Kalite kapısı bu kayıtları `generated-baseline`, `liveEligible:false`, `humanReviewRequired:true` durumuna getiriyor.

### 3. Semantik tekrar kontrolü

Tam metin benzersizliği artık yeterli değil. Yeni parmak izi sistemi:

- sayısal değerleri normalize eder,
- üretim bağlamı/oturum başlıklarını ayıklar,
- sınav + ders + konu + normalize soru kökü üzerinden aile oluşturur,
- aynı semantik aileden varsayılan en fazla 4 kaydı ikinci inceleme kuyruğuna bırakır,
- fazlasını `semantic-family-overuse` nedeniyle karantinaya alır.

Bu özellikle V142–V301 arasındaki 8.000 şablon-ağırlıklı kaydın gerçek çeşitlilik açısından yeniden değerlendirilmesini sağlar.

### 4. Yeni içerik rubriği

`CONTENT_REVIEW_RUBRIC_V1.md` eklendi. Altı başlık 12 puan üzerinden puanlanır:

- kazanım/konu uyumu,
- tek doğru ve çeldirici kalitesi,
- muhakeme düzeyi,
- dil ve açıklık,
- özgünlük/semantik çeşitlilik,
- zorluk kalibrasyonu.

Aktif-havuz adaylığı için en az 10/12 ve sert eleme kriterlerinin tamamından geçme zorunludur.

### 5. Sayaç ve kalite statüsü ayrıldı

Manifest artık 15.000 sayısını `generatedQuestionTotal` olarak da açıkça tutuyor. `verifiedQuestionTotal` eski uyumluluk alanı olarak korunuyor fakat bunun teknik sayaç olduğu not edildi.

- `status: quality-remediation`
- `livePoolReady: false`
- `liveEligibleCount: 0`
- `qualityTargetReached: false`

Bu sayede teknik üretim hedefinin tamamlanmış olması, içerik kalite hedefinin tamamlandığı anlamına gelmiyor.

## Sonraki kalite turu

1. Semantik karantinadaki büyük aileleri gerçek farklı çözüm yollarıyla yeniden yaz.
2. Önce yüksek etkili TYT Türkçe, TYT Matematik, AYT Matematik ve AYT Fen ailelerini çeşitlendir.
3. Her yeniden yazılan aileyi ikinci içerik turundan geçir.
4. Rubrik puanı 10/12 altında kalanları tekrar revizyona gönder.
5. `liveEligible` sayacı yalnız gerçekten geçen kayıtlarla artırılsın.

## Durum

**PASS:** kalite güvenlik sistemi kuruldu ve bilinen sistematik sorunlar için düzeltme kuralları eklendi.

**DEVAM EDİYOR:** 15.000 kaydın tamamını semantik açıdan birbirinden yeterince farklı, YKS düzeyinde ve ikinci içerik incelemesinden geçmiş hale getirme süreci.
