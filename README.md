# YKS2027 Arena

Zeus Edition görsel çekirdeğine sahip, Android 10–16 hedefli YKS hazırlık PWA'sı.

- Canlı PWA: https://zorbirey.github.io/YKS2027-Arena/
- Güncel PWA ID: 20260824-03
- Ücretsiz: en fazla 50 soruluk günlük çalışma hedefi, doğrulanmış soru havuzu, 44 üniteli ayrıntılı Dersler kataloğu, ham deneme sonucu ve temel ilerleme raporu
- Premium: program kişiselleştirme ve boş gün dağıtımı, sınırsız/reklamsız kullanım, deneme ve yazılı senaryoları, tahmini OBP, 2025 taban puanlarıyla üniversite/bölüm karşılaştırması ve Veli Takip Paneli

## Ücretsiz kullanım kuralları

- Her 10 sorudan sonra doğrulanmış ödüllü reklam gerekir.
- Günlük soru sınırı 50'dir.
- Beşinci farklı akıllı nottan sonra yeni not için ödüllü reklam gerekir.
- Her ünitenin dört sayfasında konu anlatımı, kavram şeması/grafiği, çözümlü örnek, akıllı not ve doğrulama kaynakları bulunur; ücretsiz üyelikte sonraki her sayfa ödüllü reklam veya Premium seçimiyle açılır.
- Altıncı tamamlanmış ödüllü reklamda ücretsiz erişim Türkiye saatiyle ertesi gün 08.00'e kadar kilitlenir.
- Soru veya reklam kotası doluyken uygulamaya giriş Premium ekranına yönlenir.

Kota verileri cihazda tutulur. Üretimde cihazlar arası ve kötüye kullanıma dayanıklı kota için kullanıcı hesabı/sunucu kaydı gerekir.

## Doğrulama gerektiren entegrasyonlar

Ödüllü reklam kapısı sahte bir sayaçla açılmaz. window.YKS2027_REWARDED_AD_PROVIDER.show çağrısının hem completed: true hem granted: true döndürmesi gerekir. Google Publisher Tag gibi bir sağlayıcıda bu değerler video-tamamlandı ve ödül-verildi olaylarından üretilmelidir. Reklam birimi ve yayıncı hesabı tanımlanana kadar ücretsiz geçiş butonu kapalı kalır.

Arkadaş davet hakkı yalnız verifiedByServer: true olan üyelik sunucusu yanıtıyla etkinleşir. İlk, ikinci ve üçüncü doğrulanmış arkadaş sırasıyla +1, +2 ve +3 gün reklamsız ücretsiz kullanım kazandırır. 6 haneli veli kodu arayüzü hazırdır; güvenli cihazlar arası giriş için üyelik sunucusuna bağlanmalıdır.

- Ödüllü reklam teknik kaynağı: https://developers.google.com/publisher-tag/samples/display-rewarded-ad
- MEB-TTKB program kaynağı: https://ttkb.meb.gov.tr/meb_iys_dosyalar/2025_05/20144001_202505.pdf
- MEB OGM Materyal: https://ogmmateryal.eba.gov.tr/
- Açık erişimli kavram doğrulaması: OpenStax Precalculus 2e, Calculus Volume 1, University Physics Volume 1, Chemistry 2e ve Biology 2e

OBP hesaplaması 2026 ÖSYM kuralını referans alır; 2027 kılavuzu yayımlandığında yeniden doğrulanmalıdır. Yerleştirme karşılaştırması ÖSYM'nin 2025 genel kontenjan en küçük puan tablolarından üretilmiştir ve yerleşme garantisi değildir.

Premium arayüz ve erişim sınırı hazırdır. Gerçek üyelik doğrulaması ve ödeme için güvenli bir kimlik/ödeme sağlayıcısı bağlanmalıdır; yalnız istemci tarafındaki bir PWA ödeme güvenliği sağlamaz.
