# YKS2027 Arena

Zeus Edition görsel çekirdeğine sahip, Android 10–16 hedefli YKS hazırlık PWA'sı.

- Canlı PWA: https://zorbirey.github.io/YKS2027-Arena/
- Güncel PWA ID: 20260824-09
- Ortak AI öğretmen karar işareti: `ARENA-AI-TEACHER-V1`
- Ücretsiz: en fazla 50 soruluk günlük çalışma hedefi, doğrulanmış soru havuzu, 44 üniteli ayrıntılı Dersler kataloğu, ham deneme sonucu ve temel ilerleme raporu
- Premium: program kişiselleştirme ve boş gün dağıtımı, sınırsız/reklamsız kullanım, deneme ve yazılı senaryoları, tahmini OBP, 2025 taban puanlarıyla üniversite/bölüm karşılaştırması ve Veli Takip Paneli

## Ücretsiz kullanım kuralları

- Her 10 sorudan sonra doğrulanmış ödüllü reklam gerekir.
- Günlük soru sınırı 50'dir.
- Beşinci farklı akıllı nottan sonra yeni not için ödüllü reklam gerekir.
- Her ünitede konu anlatımı, kavram şeması/grafiği, çözümlü örnek, akıllı not, doğrulama kaynakları ve “sık karşılaşılan soru biçimleri–çeldiriciler–dikkat noktaları–sınav kullanımı” rehberi bulunur. İlk soru laboratuvarı sekiz dersten seçilmiş konularda Kolay, Orta, Orta Üst, Zor ve Efsane düzeylerinde toplam 40 özgün soru içerir; ücretsiz üyelikte sonraki her sayfa ödüllü reklam veya Premium seçimiyle açılır.
- Altıncı tamamlanmış ödüllü reklamda ücretsiz erişim Türkiye saatiyle ertesi gün 08.00'e kadar kilitlenir.
- Soru veya reklam kotası doluyken uygulamaya giriş Premium ekranına yönlenir.

Kota verileri cihazda tutulur. Üretimde cihazlar arası ve kötüye kullanıma dayanıklı kota için kullanıcı hesabı/sunucu kaydı gerekir.
Günlük kilit açılışı GitHub Pages yanıtındaki sunucu saatiyle doğrulanır ve çalışma oturumunda tekdüze sayaçla ilerletilir; cihaz saatini ileri veya geri almak kilidi açmaz. Sunucu zamanı doğrulanamazsa güvenlik nedeniyle kilit açık kalır. Yalnız istemci tarafındaki PWA'da uygulama verilerini tamamen silme veya farklı cihaz kullanma saldırısını kesin olarak engellemek mümkün değildir; bunun için kullanıcı hesabına bağlı sunucu tarafı kota kaydı gerekir.

## Google Play değerlendirme akışı

- İstek, kullanıcı uygulamaya girdikten sonra toplam 15 görünür dakika ve en az 3 anlamlı çalışma işlemi tamamlandığında değerlendirilir.
- Metin tarafsızdır; belirli bir yıldız sayısı istenmez, değerlendirme karşılığında reklam veya erişim avantajı verilmez.
- “Daha sonra” seçimi 60 gün, mağaza sayfasını açma 365 gün yeniden gösterimi erteler; kullanıcı isterse kalıcı olarak kapatabilir.
- Akış yalnız `store-config-v1.js` içindeki doğrulanmış Google Play ürün adresi tanımlandığında görünür. Depoda veya herkese açık Google Play aramasında YKS2027 Arena paket kimliği bulunmadığı için sahte adres kullanılmamıştır.
- Politika kaynakları: https://support.google.com/googleplay/android-developer/answer/9898684 ve https://developer.android.com/guide/playcore/in-app-review

## Doğrulama gerektiren entegrasyonlar

Ödüllü reklam sağlayıcısı bağlanana kadar geçici reklam akışı sekiz görünür saniyelik geri sayımla çalışır; uygulama arka plana alınırsa sayaç durur ve tamamlanmadan ödül verilmez. Gerçek sağlayıcı bağlandığında window.YKS2027_REWARDED_AD_PROVIDER.show çağrısının hem completed: true hem granted: true döndürmesi gerekir. Google Publisher Tag gibi bir sağlayıcıda bu değerler video-tamamlandı ve ödül-verildi olaylarından üretilmelidir.

Arkadaş davet hakkı yalnız verifiedByServer: true olan üyelik sunucusu yanıtıyla etkinleşir. İlk, ikinci ve üçüncü doğrulanmış arkadaş sırasıyla +1, +2 ve +3 gün reklamsız ücretsiz kullanım kazandırır. 6 haneli veli kodu arayüzü hazırdır; güvenli cihazlar arası giriş için üyelik sunucusuna bağlanmalıdır.

- Ödüllü reklam teknik kaynağı: https://developers.google.com/publisher-tag/samples/display-rewarded-ad
- MEB-TTKB program kaynağı: https://ttkb.meb.gov.tr/meb_iys_dosyalar/2025_05/20144001_202505.pdf
- MEB OGM Materyal: https://ogmmateryal.eba.gov.tr/
- MEB ÖDSGM 12. Sınıf Kazanım Kavrama Testleri: https://odsgm.meb.gov.tr/www/12sinif-kazanim-kavrama-testleri/icerik/1657
- ÖSYM 2025 YKS temel soru kitapçıkları: https://www.osym.gov.tr/2025yks-tyt-ayt-ve-ydt-temel-soru-kitapciklari-ve-cevap-anahtarlari
- Açık erişimli kavram doğrulaması: OpenStax Precalculus 2e, Calculus Volume 1, University Physics Volume 1, Chemistry 2e ve Biology 2e

OBP hesaplaması 2026 ÖSYM kuralını referans alır; 2027 kılavuzu yayımlandığında yeniden doğrulanmalıdır. Yerleştirme karşılaştırması ÖSYM'nin 2025 genel kontenjan en küçük puan tablolarından üretilmiştir ve yerleşme garantisi değildir.

Premium arayüz ve erişim sınırı hazırdır. Gerçek üyelik doğrulaması ve ödeme için güvenli bir kimlik/ödeme sağlayıcısı bağlanmalıdır; yalnız istemci tarafındaki bir PWA ödeme güvenliği sağlamaz.

## Arena AI Öğretmen ortak standardı

`ARENA-AI-TEACHER-V1`, tüm Arena projelerinde kullanılacak ürün ve entegrasyon sözleşmesidir. Görsel soru çözümü harici Photomath akışı olarak ayrı tutulur; Arena AI Öğretmen yalnızca doğrulanmış ders içeriklerine dayalı metin öğretmenidir. Ücretsiz pakette toplam 3, Premium'da ayda 5 tanıtım sorusu; Pro'da başlangıçta günde 10 ve ayda 200 soru planlanır. API anahtarı istemciye konmaz, üyelik ve kota sunucuda doğrulanır, doğrudan kişisel bilgiler modele gönderilmez. Gerçek sunucu ve sağlayıcı bağlı olmadığı sürece arayüz özelliği canlıymış gibi göstermez.

Paylaşılan Codex standardı: `standards/arena-ai-teacher-standard/SKILL.md`. Diğer Arena projelerinde `$arena-ai-teacher-standard` veya `ARENA-AI-TEACHER-V1 ile uygula` denebilir.
