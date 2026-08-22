# YKS2027 Arena — İçerik Kalite Rubriği V1

Bu rubrik, `generated-baseline` kaydın ikinci içerik kontrolünden geçerek aktif soru havuzuna aday olabilmesi için kullanılır. MEB/ÖSYM tarafından soru bazında onay anlamına gelmez.

## Sert eleme kriterleri

Aşağıdakilerden biri varsa soru puanlanmadan karantinaya alınır:

- Beş seçenek içinde ikinci doğru veya güçlü ikinci doğru yorumu bulunması
- Soru kökünün eksik fiziksel/kimyasal/matematiksel bilgi nedeniyle çözülememesi
- Yanlış konu/kazanım etiketi
- Çıkmış ÖSYM sorusunun metin, senaryo veya özgün seçenek yapısının kopyalanması
- Aynı semantik soru ailesinin aktif havuz kotasını aşması
- `correctIndex` ile açıklamanın uyuşmaması
- Sayısal soruda bağımsız ikinci hesap kontrolünün başarısız olması

## Puanlama

Her başlık 0–2 puandır. Toplam 12 puan üzerinden değerlendirilir.

### 1. Kazanım ve konu uyumu
- 0: Yanlış konu/kazanım veya kapsam dışı
- 1: Konuyla ilişkili ancak yüzeysel/etiketi geniş
- 2: Hedeflenen kazanımı doğrudan ve doğru ölçüyor

### 2. Tek doğru ve çeldirici kalitesi
- 0: İkinci doğru/yorum riski var
- 1: Tek doğru var ancak çeldiriciler zayıf
- 2: Tek doğru tartışmasız, dört çeldirici makul ve farklı hata türlerini temsil ediyor

### 3. Muhakeme düzeyi
- 0: Yalnız mekanik ezber veya anlamsız işlem
- 1: Tek adımlı uygulama
- 2: Yorum, ilişkilendirme, veri okuma veya çok adımlı düşünme gerektiriyor

### 4. Dil ve soru kökü açıklığı
- 0: Muğlak, eksik veya gereksiz karmaşık
- 1: Anlaşılır ancak iyileştirilebilir
- 2: Açık, ölçülü, sınav diline uygun ve gereksiz ipucu içermiyor

### 5. Özgünlük ve semantik çeşitlilik
- 0: Var olan şablonun yalnız sayı/bağlam değiştirilmiş kopyası
- 1: Aynı ailede belirgin varyasyon
- 2: Çözüm yolu, veri sunumu veya ölçülen düşünme becerisi açısından gerçek çeşitlilik sağlıyor

### 6. Zorluk kalibrasyonu
- 0: Etiket rastgele/teknik kuraldan atanmış veya belirgin yanlış
- 1: Yaklaşık doğru
- 2: Çözüm adımı, bilgi yükü ve çeldirici gücüyle uyumlu

## Geçiş kuralı

- 10–12: İkinci kontrolü geçen aktif-havuz adayı
- 8–9: Revizyon sonrası yeniden inceleme
- 0–7: Karantina / yeniden yazım

Ek olarak sert eleme kriterlerinden hiçbiri bulunmamalıdır.

## Semantik aile kotası

Aktif havuzda aynı normalize edilmiş soru ailesinden varsayılan en fazla 4 kayıt tutulur. Büyük soru bankasında aynı kazanım tekrar edebilir; ancak yalnız sayıları, kişi adlarını veya bağlam başlığını değiştirerek aynı çözüm yolunu çoğaltmak ayrı soru kabul edilmez.

## Sayısal sorular

Sayısal ve formül tabanlı her soru üretim mantığından bağımsız ikinci hesapla doğrulanır. Birim, yuvarlama ve özel durumlar ayrıca kontrol edilir.

## Aktif havuza geçiş

Bir kaydın aktif havuza geçebilmesi için:

1. Yapısal QA geçmeli.
2. Sayısalsa bağımsız ikinci hesap geçmeli.
3. Semantik aile kotasını aşmamalı.
4. Bu rubrikten en az 10/12 almalı.
5. İkinci bağımsız içerik turu `independentSemanticReview: true` olarak kaydedilmeli.
6. `liveEligible: true` ancak bu aşamadan sonra yazılmalı.
