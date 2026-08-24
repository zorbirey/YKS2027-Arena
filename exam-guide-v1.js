(function(){
  'use strict';
  const profiles={};
  const questions={};
  const difficultyOrder=['Kolay','Orta','Orta Üst','Zor','Efsane'];
  const sources=[
    {label:'MEB ÖDSGM — 12. Sınıf Kazanım Kavrama Testleri',url:'https://odsgm.meb.gov.tr/www/12sinif-kazanim-kavrama-testleri/icerik/1657',note:'Kazanım kapsamı ve ölçme biçimi doğrulaması.'},
    {label:'MEB OGM — Dört Dörtlük Matematik 12',url:'https://ogmmateryal.eba.gov.tr/panel/upload/etkilesimli/kitap/konu-pekistirme/12/matematik/matematik.pdf',note:'12. sınıf matematik kazanım ve soru yapısı doğrulaması.'},
    {label:'MEB OGM — Dört Dörtlük Fizik 12',url:'https://ogmmateryal.eba.gov.tr/panel/upload/etkilesimli/kitap/konu-pekistirme/12/fizik/fizik.pdf',note:'12. sınıf fizik kazanım ve soru yapısı doğrulaması.'},
    {label:'MEB OGM — Dört Dörtlük Kimya 12',url:'https://ogmmateryal.eba.gov.tr/panel/upload/etkilesimli/kitap/konu-pekistirme/12/kimya/index.html',note:'12. sınıf kimya kazanım ve soru yapısı doğrulaması.'},
    {label:'MEB OGM — Dört Dörtlük Biyoloji 12',url:'https://ogmmateryal.eba.gov.tr/panel/upload/etkilesimli/kitap/konu-pekistirme/12/biyoloji/biyoloji.pdf',note:'12. sınıf biyoloji kazanım ve soru yapısı doğrulaması.'},
    {label:'ÖSYM — 2025 YKS Temel Soru Kitapçıkları',url:'https://www.osym.gov.tr/2025yks-tyt-ayt-ve-ydt-temel-soru-kitapciklari-ve-cevap-anahtarlari',note:'Soru dili, bağlam ve muhakeme biçimi incelemesi.'}
  ];

  function addProfile(course,title,questionTypes,distractors,cautions,examUse){
    profiles[course+'|'+title]={questionTypes:questionTypes,distractors:distractors,cautions:cautions,examUse:examUse};
  }
  function addQuestion(course,title,difficulty,stem,options,answer,explanation,distractorNotes,attention){
    const key=course+'|'+title;
    if(!questions[key])questions[key]=[];
    questions[key].push({
      id:'EV1-'+String(Object.values(questions).reduce(function(total,list){return total+list.length;},0)+1).padStart(3,'0'),
      difficulty:difficulty,stem:stem,options:options,answer:answer,explanation:explanation,
      distractorNotes:distractorNotes,attention:attention,
      sourceBasis:'MEB kazanım kapsamı ve ÖSYM soru biçimi incelenerek YKS2027 Arena için özgün hazırlanmıştır.'
    });
  }

  addProfile('Matematik','Üstel ve Logaritmik Fonksiyonlar',
    ['Tanım koşullu logaritma denklemi','Üstel-logaritmik grafik ve dönüşüm yorumu','Büyüme ya da azalma bağlamında model kurma'],
    ['Logaritma içini pozitif yapmayan kökü kabul ettirme','0<a<1 tabanında artma-azalma yönünü ters düşündürme','log(a+b) ifadesini log a+log b gibi ayırdırma'],
    ['Her işlemden önce taban ve tanım koşulunu yaz','Grafikte y=0 ve x=0 eksen yaklaşımını karıştırma','Cebirsel aday kökü başlangıç denkleminde denetle'],
    'Soru; denklem, grafik veya gerçek yaşam büyüme modeli üzerinden gelir. En güçlü çözüm sırası tanım koşulu, uygun dönüşüm ve son kontrol biçimindedir.');
  addProfile('Matematik','Diziler',
    ['Genel terimden belirli terim bulma','Aritmetik-geometrik dizi toplamı','Örüntü ya da özyinelemeli tanım yorumlama'],
    ['n ile n−1 adım sayısını karıştırma','Ortak fark yerine oran kullanma','Geometrik toplamda r=1 özel durumunu unutma'],
    ['Dizinin türünü ilk iki fark/oranla doğrula','İlk terim ile başlangıç indeksini ayır','Sonuçta terim sayısını yeniden say'],
    'Diziler doğrudan bağıntı, tablo veya örüntü bağlamında sorulabilir; son yılların muhakeme diline uygun olarak birden fazla gösterim arasında geçiş beklenir.');
  addProfile('Matematik','Trigonometri',
    ['Birim çemberde işaret ve bölge','Trigonometrik denklem ve periyot','Özdeşlik kullanarak ifade sadeleştirme'],
    ['Referans açıyı tek çözüm sanma','Derece ile radyanı aynı işlemde karıştırma','Tanım dışı değerde payda sadeleştirme'],
    ['Önce aralığı ve açı birimini işaretle','Bölgeye göre işareti ayrı kontrol et','Bulduğun tüm çözümleri verilen aralığa süz'],
    'Sınavda birim çember, grafik ve cebir aynı soruda birleşebilir. Ana değer ile periyodik çözüm kümesini ayırmak belirleyicidir.');
  addProfile('Matematik','Dönüşümler ve Analitik Geometri',
    ['Grafik öteleme ve yansıma','Nokta-doğru uzaklığı veya eğim','Dönüşüm sırasının sonuca etkisi'],
    ['f(x−h) ifadesini sola öteleme sanma','Dik doğrularda eğim çarpımını işaretsiz alma','Dönüşümlerin sırasını önemsiz kabul etme'],
    ['Yatay dönüşümü parantez içinde oku','Düşey ve yatay işlemleri ayrı satırda uygula','Koordinatı son denklemde yerine koyarak doğrula'],
    'Koordinat düzlemi üzerinde şekil, fonksiyon grafiği veya doğru ilişkisi verilir; görseli cebirsel kurala çevirmek temel beceridir.');
  addProfile('Matematik','Limit ve Süreklilik',
    ['Belirsizliği çarpanlara ayırarak giderme','Sağ-sol limit karşılaştırması','Parçalı fonksiyonda süreklilik parametresi'],
    ['0/0 görünce limitin sıfır olduğunu düşündürme','Fonksiyon değeri ile limit değerini eşitlemeden geçme','Yalnız tek yönlü limiti kontrol ettirme'],
    ['Önce doğrudan yerine koy ve belirsizliği tanı','Süreklilikte sol limit=sağ limit=f(a) zincirini yaz','Kök içeren ifadede eşlenikleştirmenin koşulunu koru'],
    'Grafik okuma, cebirsel limit ve parametreli süreklilik soruları sık kullanılır. Zor sorular iki tekniği aynı çözüm içinde birleştirir.');
  addProfile('Matematik','Türev',
    ['Anlık değişim ve teğet eğimi','Artan-azalan ve ekstremum analizi','Optimizasyon ya da hız bağlamı'],
    ['f′(x)=0 olan her noktayı ekstremum sayma','Zincir kuralında iç türevi unutma','Kritik noktayı tanım aralığı dışında kullanma'],
    ['Tanım aralığını türev tablosundan önce yaz','İşaret değişimini kritik noktanın iki yanında sınat','Optimizasyonda istenen büyüklüğü açıkça fonksiyonlaştır'],
    'Soru grafik, tablo veya gerçek yaşam modeliyle türevin anlamını yoklayabilir; yalnız işlem değil işaret ve yorum bağlantısı beklenir.');
  addProfile('Matematik','İntegral',
    ['Belirsiz integral ve sabit','Belirli integral ile işaretli alan','İki eğri arasında alan'],
    ['İntegral sabitini unutma','Eksen altında kalan alanı negatif bırakma','Üst-alt fonksiyonu kesişim kontrolü yapmadan seçme'],
    ['Alan sorusunda kesişim noktalarını bul','Geometrik alan ile işaretli integrali ayır','Türev alarak belirsiz integral sonucunu kontrol et'],
    'İntegral çoğunlukla alan, birikim veya türevin tersi olarak kullanılır; parçalı bölgelerde aralığı bölmek kritik adımdır.');

  addProfile('Türk Dili ve Edebiyatı','Giriş ve Edebiyatın Bilimlerle İlişkisi',
    ['Edebiyatın bilim ve güzel sanatlarla ilişkisi','Metnin hangi disiplinden yararlandığını çıkarma','Kurgu-gerçeklik ve dil işlevi karşılaştırması'],
    ['Bilimsel doğruluk ile edebî gerçekliği özdeşleştirme','Her tarihî metni edebiyat eseri sayma','Sanat dallarının malzemelerini karıştırma'],
    ['Yargıyı metindeki sözcük ve amaçla destekle','Eserin konusu ile yöntemini ayır','Bilgi verme ile estetik etkiyi birlikte değerlendirebil'],
    'Kısa bir parçada sosyoloji, tarih, psikoloji veya felsefe bağlantısı sezdirilir; adaydan ilişkiyi gerekçesiyle çıkarması istenir.');
  addProfile('Türk Dili ve Edebiyatı','Hikâye',
    ['Olay-durum hikâyesini ayırma','Anlatıcı ve bakış açısı belirleme','Anlatım tekniğini metinden çıkarma'],
    ['Yazar ile anlatıcıyı aynı kişi sayma','İç konuşma ile bilinç akışını karıştırma','Olay azlığını konu yokluğu sanma'],
    ['Kişi zamirinden önce anlatıcının bilgi sınırına bak','Tekniği bir cümleyle değil bütün bağlamla doğrula','Tür özelliğini metindeki yapı ve sonuca bağla'],
    'Özgün bir mikro metin üzerinden bakış açısı, teknik, yapı veya hikâye anlayışı sorulabilir; ezber isimden çok metin kanıtı belirleyicidir.');
  addProfile('Türk Dili ve Edebiyatı','Şiir',
    ['Nazım biçimi ve birim çıkarımı','İmge, söz sanatı ve tema','Dönem/topluluk poetikası karşılaştırması'],
    ['Kafiye ile redifi karıştırma','Şair biyografisinden metinde olmayan sonuç çıkarma','Tema ile konuyu özdeşleştirme'],
    ['Ek ve sözcük tekrarlarını görev-anlam bakımından incele','Dönem yargısını en az iki metin ipucuyla kur','Ölçü, birim ve uyak düzenini ayrı belirle'],
    'Dize veya kısa şiir parçası üzerinden biçim ve anlam birlikte yoklanır; bir özelliği dönem etiketiyle değil metin kanıtıyla eşleştirmek gerekir.');
  addProfile('Türk Dili ve Edebiyatı','Roman',
    ['Anlatıcı, zaman ve mekân çözümlemesi','Roman türü veya anlayışı belirleme','Karakter-tip ve anlatım tekniği'],
    ['Kronolojik olmayan anlatıyı zaman belirsizliği sanma','Tip ile karakteri yalnız kişi sayısıyla ayırma','Geriye dönüşü özetleme ile karıştırma'],
    ['Olay zamanı ile anlatma zamanını ayır','Kişinin değişim ve özgünlük düzeyine bak','Tür yargısını tema, yapı ve anlatım kanıtıyla kur'],
    'Bir roman parçasından yapı ve teknik; eser-yazar bilgisinden ise dönem ilişkisi sorulabilir. Bağlam sorularında metindeki hareket noktası esastır.');
  addProfile('Türk Dili ve Edebiyatı','Tiyatro',
    ['Trajedi-komedi-dram özellikleri','Sahne terimleri ve yapı unsurları','Geleneksel-modern tiyatro karşılaştırması'],
    ['Perde ile sahneyi aynı kavram sayma','Meddah, Karagöz ve orta oyununu karıştırma','Metindeki diyalogu tek başına tiyatro kanıtı sayma'],
    ['Gösterme ve anlatma yöntemlerini ayır','Tür özelliğini çatışma ve sonuçla ilişkilendir','Parantez içi açıklamaların sahne yönergesi olduğunu unutma'],
    'Sahne parçası, geleneksel gösteri özelliği veya tiyatro terimi bağlamında sınıflandırma ve çıkarım soruları gelebilir.');
  addProfile('Türk Dili ve Edebiyatı','Deneme ve Eleştiri',
    ['Deneme-eleştiri ayrımı','Öznel ve nesnel yargı işlevi','Eleştiri yaklaşımı ve ölçütü'],
    ['Her öznel metni deneme sayma','Eleştiriyi yalnız olumsuz yargı sanma','Kanıt kullanılan denemeyi bilimsel makale sayma'],
    ['Metnin temel amacını belirle','Yazarın kesinlik iddiası ve kanıt düzenine bak','Değerlendirilen eser ile metnin konusunu ayır'],
    'Kısa metnin türünü belirleme veya eleştirmenin hangi ölçütü kullandığını çıkarma biçiminde sorulur; amaç ve söyleyiş tonu birlikte okunmalıdır.');
  addProfile('Türk Dili ve Edebiyatı','Söylev ve Mülakat',
    ['Söylev-mülakat-röportaj ayrımı','Hitabetin amaç ve teknikleri','Soru-cevap metninde hazırlık ve nesnellik'],
    ['Mülakat ile iş görüşmesini bağlamdan kopuk özdeşleştirme','Her soru-cevap metnini röportaj sayma','Coşkulu dili tek başına söylev kanıtı sayma'],
    ['Konuşmacı, hedef kitle ve amacı üçlü olarak belirle','Soruların uzman görüşü mü saha gözlemi mi topladığına bak','Seslenme ve ikna unsurlarını işleviyle yorumla'],
    'Bir konuşma ya da görüşme parçasının türü, amacı ve dil özellikleri sorulabilir; iletişim durumu sorunun anahtarıdır.');

  addProfile('Fizik','Çembersel Hareket',
    ['Merkezcil ivme ve kuvvet hesabı','Açısal-doğrusal büyüklük ilişkisi','Düşey çember veya viraj dinamiği'],
    ['Merkezcil kuvveti ayrı bir kuvvet türü sanma','Hız sabitken ivmenin sıfır olduğunu düşünme','Yarıçap değişiminde açısal ve çizgisel hızı karıştırma'],
    ['Önce merkeze doğru ekseni çiz','Net radyal kuvveti gerçek kuvvetlerden kur','v=ωr ve a=v²/r bağıntılarının hangi büyüklüğü sabit tuttuğunu yaz'],
    'Düzeneğin kuvvet diyagramı ile hareket bağıntısı birleştirilir. Zor sorular aynı sistemde enerji veya minimum hız koşulu da kullanır.');
  addProfile('Fizik','Basit Harmonik Hareket',
    ['Yay/sarkaç periyodu','Konum-hız-ivme faz ilişkisi','Enerji dönüşümü ve genlik'],
    ['Denge noktasında ivmeyi maksimum sanma','Genlik artınca ideal periyodun kesin değiştiğini düşünme','Hız ile ivmenin yönünü aynı kabul etme'],
    ['Denge ve uç noktaları ayrı değerlendir','Periyot bağıntısında sisteme ait değişkenleri seç','Enerji korunumunda referans konumunu belirt'],
    'Grafik, enerji ve periyot aynı soruda eşleştirilebilir; konumun işareti ile ivmenin ters yönlü olması sık ölçülen ilişkidir.');
  addProfile('Fizik','Dalga Mekaniği',
    ['Dalga hızı-frekans-dalga boyu','Girişim ve kırınım','Doppler veya duran dalga yorumu'],
    ['Ortam değişince frekansın kaynaktan bağımsız değiştiğini sanma','Genlik ile hızı karıştırma','Düğüm ve karın noktalarını ters yorumlama'],
    ['v=fλ bağıntısında hangi büyüklüğün sabit olduğunu yaz','Yol farkını dalga boyu cinsinden kontrol et','Şekilde ardışık düğümler arası uzaklığın λ/2 olduğunu unutma'],
    'Dalga grafiği veya deney düzeneği üzerinden nicel ilişki ve nitel değişim birlikte sorulur; ortam-kaynak ayrımı önemlidir.');
  addProfile('Fizik','Atom Fiziğine Giriş ve Radyoaktivite',
    ['Atom modellerinin açıklama gücü','Yarı ömür ve etkinlik hesabı','Nükleer tepkimede korunumluluk'],
    ['Kütle numarası ile atom numarasını karıştırma','Yarı ömrü doğrusal azalma sanma','Işınım türlerinin yük ve nüfuzunu ters eşleştirme'],
    ['Tepkimede A ve Z toplamlarını iki tarafta kontrol et','Geçen yarı ömür sayısını tam belirle','Modeli açıkladığı deneysel bulguyla eşleştir'],
    'Tablo, bozunma grafiği veya model karşılaştırması kullanılır; hem hesap hem fiziksel yorum beklenebilir.');
  addProfile('Fizik','Modern Fizik',
    ['Fotoelektrik olay','Özel görelilikte zaman/uzunluk','Madde dalgaları ve kuantum yorumu'],
    ['Işık şiddeti ile frekansın etkisini karıştırma','Klasik hız toplamasını ışığa uygulama','Foton enerjisi ile elektronun maksimum kinetiğini özdeşleştirme'],
    ['E=hf bağıntısında eşik enerjiyi ayır','Referans çerçevesini açıkça belirle','Deney sonucunu klasik ve modern açıklamayla karşılaştır'],
    'Deneysel gözlemden hangi modelin desteklendiği sorulur; grafik ve eşik koşulu içeren fotoelektrik soruları özellikle ayırt edicidir.');
  addProfile('Fizik','Modern Fiziğin Teknolojideki Uygulamaları',
    ['Yarı iletken ve diyot uygulaması','Lazer, görüntüleme ve sensörler','Nanoteknoloji veya süperiletkenlik'],
    ['Teknolojiyi dayandığı fizik ilkesiyle yanlış eşleştirme','Lazeri yalnız yüksek şiddetli ışık sanma','Yarı iletkende sıcaklık etkisini metallerle aynı yorumlama'],
    ['Cihazın giriş-çıkış dönüşümünü belirle','Kavramı günlük adından değil çalışma ilkesinden seç','Yarar ile güvenlik/sınırlılık yargılarını ayır'],
    'Günlük bir cihazın çalışma ilkesi veya yeni teknoloji senaryosu verilir; kavramı bağlama uygulama ve sonuç çıkarma beklenir.');

  addProfile('Kimya','Kimya ve Elektrik',
    ['Galvanik hücrede anot-katot','Standart hücre potansiyeli','Elektroliz ve Faraday hesabı'],
    ['Anodu her zaman negatif sanma','Elektron ve iyon hareketini aynı yönde çizme','Elektron molü ile madde molünü katsayısız eşitleme'],
    ['Önce yükseltgenme ve indirgenme yarı tepkimelerini yaz','E°hücre=E°katot−E°anot işaretini koru','Elektrolizde yük-elektron-madde molü zincirini kur'],
    'Hücre şeması, potansiyel tablosu ve elektroliz hesabı kullanılabilir; zor sorular iki hücreyi veya stokiyometriyi birleştirir.');
  addProfile('Kimya','Karbon Kimyasına Giriş',
    ['Karbonun hibritleşmesi ve bağ yapısı','Organik-inorganik bileşik ayrımı','Basit formül-molekül formülü hesabı'],
    ['Her karbonlu bileşiği organik sayma','Sigma ve pi bağlarını karıştırma','Hibritleşmeyi yalnız bağ sayısıyla yüzeysel belirleme'],
    ['Merkez atom çevresindeki elektron bölgelerini say','CO, CO₂, karbonatlar gibi kapsam istisnalarını kontrol et','Yüzde bileşimde en küçük mol oranına indirgeme yap'],
    'Yapı formülü veya deneysel veri verilip bağ türü, geometri ve formül çıkarımı istenir; gösterimler arasında geçiş önemlidir.');
  addProfile('Kimya','Organik Bileşikler',
    ['Fonksiyonel grup tanıma','Adlandırma ve izomerlik','Temel organik tepkime türü'],
    ['En uzun zinciri yanlış seçme','Konum izomeri ile fonksiyonel grup izomerini karıştırma','Alkol ve eteri yalnız molekül formülüne bakarak ayırma'],
    ['Önce fonksiyonel grubu sonra ana zinciri belirle','Numaralandırmayı en küçük konum kuralıyla denetle','İzomerlikte molekül formülünün aynı kaldığını kontrol et'],
    'Çizgi-bağ formülü, ad veya tepkime ürünü üzerinden sınıflandırma yapılır; birkaç fonksiyonel grubun birlikte bulunduğu yapılar ayırt edicidir.');
  addProfile('Kimya','Enerji Kaynakları ve Bilimsel Gelişmeler',
    ['Yakıtların enerji ve çevre etkisi','Yenilenebilir kaynak karşılaştırması','Nanomalzeme/polimer ve sürdürülebilirlik yorumu'],
    ['Yenilenebilir olanı sıfır etkili sanma','Enerji yoğunluğu ile toplam verimi karıştırma','Tek bir çevresel ölçüte göre kesin üstünlük kurma'],
    ['Yaşam döngüsü, verim ve emisyonu birlikte karşılaştır','Verilen tablo dışına taşan kesin yargı kurma','Bilimsel gelişmenin yarar ve riskini ayrı değerlendir'],
    'Veri tablosu veya güncel teknoloji bağlamında karşılaştırma ve karar gerekçesi istenir; bilgi kadar kanıta dayalı yorum ölçülür.');

  addProfile('Biyoloji','Genden Proteine',
    ['DNA-RNA-protein bilgi akışı','Genetik şifre ve protein sentezi hesabı','Mutasyonun ürüne etkisi'],
    ['Kalıp ve kodlayan DNA zincirini karıştırma','Stop kodonunu amino asit sayma','Her baz değişiminin proteini değiştirdiğini sanma'],
    ['Zincir yönlerini 5′ ve 3′ olarak yaz','Kodon, antikodon ve amino asit sayılarını ayrı tut','Mutasyonun kodon ve amino asit düzeyindeki sonucunu kontrol et'],
    'Şema, deney veya nükleotit dizisi üzerinden süreç ve çıkarım sorulur. Zor sorular bilgi akışıyla sayısal ilişkiyi aynı anda kullanır.');
  addProfile('Biyoloji','Canlılarda Enerji Dönüşümleri',
    ['Fotosentez-solunum karşılaştırması','ETS ve ATP üretim biçimleri','Işık/CO₂ gibi sınırlayıcı faktör grafiği'],
    ['Bitkilerin yalnız fotosentez yaptığını sanma','Oksijeni her ATP üretiminin doğrudan kaynağı sayma','Grafikte plato sonrası etkenin etkisiz olduğunu genelleme'],
    ['Olayın gerçekleştiği organel ve bölmeyi belirt','Madde akışı ile enerji akışını ayır','Grafikte diğer değişkenlerin sabitliğini kontrol et'],
    'Deney düzeneği, grafik ve organel şeması sık kullanılır; değişken kontrolü ve iki sürecin ortak/farklı yönleri ayırt edicidir.');
  addProfile('Biyoloji','Bitki Biyolojisi',
    ['Su-mineral taşınması','Bitki hormonları ve tropizma','Üreme ve gelişme döngüsü'],
    ['Ksilem ile floem yönünü mutlak tek yönlü sanma','Tropizma ile nasti hareketini karıştırma','Terleme artışını her koşulda fotosentez artışı sayma'],
    ['Yapı ile taşınan maddeyi eşleştir','Uyarının yönü ile tepkinin yönünü ayır','Çevresel etkenin birden fazla sürece etkisini denetle'],
    'Şekil, deney ve yönelim senaryosu üzerinden mekanizma sorgulanır; hormon-etki ve doku-görev eşleştirmesi temel oluşturur.');
  addProfile('Biyoloji','Canlılar ve Çevre',
    ['Popülasyon büyüme grafiği','Besin ağı ve enerji piramidi','Biyoçeşitlilik ve insan etkisi'],
    ['Birey sayısı ile biyokütleyi özdeşleştirme','Enerjinin döngü yaptığını sanma','Taşıma kapasitesini sabit ve değişmez kabul etme'],
    ['Trofik düzeyi ok yönünden belirle','Madde döngüsü ile enerji akışını ayır','Grafikte yoğunluğa bağlı etkenleri tanı'],
    'Ekolojik grafik, besin ağı veya koruma senaryosundan neden-sonuç çıkarımı istenir; tek değişkenli açıklamadan kaçınmak gerekir.');

  addProfile('T.C. İnkılap Tarihi ve Atatürkçülük','20. Yüzyıl Başlarında Osmanlı Devleti',
    ['Fikir akımları ve amaçları','Trablusgarp/Balkan savaşları sonuçları','I. Dünya Savaşı cephe ve antlaşmaları'],
    ['Olayların kronolojisini ters kurma','Cephe açılma amacı ile sonucu karıştırma','Fikir akımlarını temsil ettikleri sorunla yanlış eşleştirme'],
    ['Olayı tarih-neden-sonuç çizgisine yerleştir','Devletin amacı ile gerçekleşen sonucu ayrı yaz','Seçenekteki mutlak ifadeyi belgedeki kanıtla sınat'],
    'Kronoloji, harita veya kısa belge üzerinden imparatorluğun siyasi ve toplumsal dönüşümü yorumlatılır.');
  addProfile('T.C. İnkılap Tarihi ve Atatürkçülük','Millî Mücadele’nin Hazırlık Dönemi',
    ['Genelge ve kongre kararlarını eşleştirme','Kronoloji kurma','Ulusal egemenlik ve tam bağımsızlık çıkarımı'],
    ['Bölgesel toplanan kongreyi yalnız bölgesel kararlarla sınırlama','Temsil Heyetinin yetkilerini dönemlere göre karıştırma','Manda karşıtlığı ile dış yardımı tümden reddetmeyi özdeşleştirme'],
    ['Kararın ilk kez mi kesin olarak mı alındığını ayır','Belgenin toplanma biçimi ile karar kapsamını ayrı değerlendir','Egemenlik yargısını kararın öznesi üzerinden kanıtla'],
    'Belge cümlesi veya kararlar bütünü verilip hangi ilke, gelişme ya da sonuçla ilişkili olduğu sorulur; kronoloji ve çıkarım birlikte kullanılabilir.');
  addProfile('T.C. İnkılap Tarihi ve Atatürkçülük','Kurtuluş Savaşı Cepheleri',
    ['Doğu-Güney-Batı cephelerini karşılaştırma','Muharebe-antlaşma ilişkisi','Cephe sonucunun diplomatik etkisi'],
    ['Yerel direniş ile düzenli orduyu karıştırma','Bir antlaşmayı yanlış muharebeye bağlama','Askerî başarıyı doğrudan kesin barış sayma'],
    ['Haritada yön ve karşı kuvveti belirle','Askerî gelişme ile diplomatik sonucu zincirle','Kronolojiyi cepheler arası etkileşimle kontrol et'],
    'Harita, kronoloji veya antlaşma maddesi üzerinden savaş-diplomasi ilişkisi yorumlatılır.');
  addProfile('T.C. İnkılap Tarihi ve Atatürkçülük','Atatürk İlke ve İnkılapları',
    ['İnkılabı ilgili ilkeyle eşleştirme','İlkelerin birbirini tamamlaması','Toplumsal ve hukuki dönüşüm çıkarımı'],
    ['Bir inkılabı yalnız tek ilkeye indirgeme','Laiklik ile dinsizliği özdeşleştirme','Devletçilik ile tüm özel girişimin reddini karıştırma'],
    ['İnkılabın amacı ve etkisini birlikte oku','İlkeleri tanım değil uygulama üzerinden ayır','Birden çok ilke varsa baskın ilişkiyi gerekçelendir'],
    'Yasa, kurum veya toplumsal uygulama verilip hangi ilkeyi güçlendirdiği ve hangi ihtiyaca cevap verdiği sorulur.');
  addProfile('T.C. İnkılap Tarihi ve Atatürkçülük','Atatürk Dönemi İç Politika',
    ['Cumhuriyetin kurumlaşması','Çok partili hayata geçiş denemeleri','Toplumsal ve ekonomik politika sonuçları'],
    ['Dönemleri ve parti girişimlerini karıştırma','Neden ile bahane kavramlarını özdeşleştirme','Tek olaydan genel rejim yargısı çıkarma'],
    ['Gelişmeyi demokratikleşme ve güvenlik bağlamında birlikte değerlendir','Kuruluş-kapanış kronolojisini kontrol et','Resmî amaç ile fiilî sonucu ayır'],
    'Siyasi gelişme veya kurum değişikliği üzerinden yeni devletin öncelikleri ve karşılaştığı sorunlar yorumlanır.');
  addProfile('T.C. İnkılap Tarihi ve Atatürkçülük','Atatürk Dönemi Dış Politika',
    ['Musul, Hatay ve Boğazlar meseleleri','Yurtta barış dünyada barış ilkesi','Antlaşma ve örgüt kronolojisi'],
    ['Sorunların çözüm tarihlerini karıştırma','Barışçıl politikayı pasiflik sayma','Millî menfaat ile yayılmacılığı özdeşleştirme'],
    ['Her meselede tarafları ve çözüm yöntemini belirle','Uluslararası ortamın değişimini hesaba kat','Sonucu egemenlik ve güvenlik açısından yorumla'],
    'Bir diplomatik sorun, antlaşma maddesi veya uluslararası gelişme verilerek yöntem ve ilke ilişkisi sorulur.');
  addProfile('T.C. İnkılap Tarihi ve Atatürkçülük','II. Dünya Savaşı ve Türkiye',
    ['Türkiye’nin denge ve tarafsızlık politikası','Savaşın iç ekonomik-toplumsal etkileri','Savaş sonu uluslararası düzene geçiş'],
    ['Savaşa fiilen katılma ile diplomatik pozisyonu karıştırma','Savaş dışı kalmayı etkilenmeme sanma','Kronolojik ittifakları ters kurma'],
    ['Türkiye’nin kararını dönemin güvenlik koşullarıyla oku','İç politika tedbirlerini savaş ekonomisiyle bağla','Savaş sonu adımı yeni dünya düzeniyle ilişkilendir'],
    'Belge, zaman çizelgesi veya politika kararı üzerinden Türkiye’nin değişen uluslararası koşullara verdiği tepki yorumlatılır.');
  addProfile('T.C. İnkılap Tarihi ve Atatürkçülük','Soğuk Savaş’tan Küreselleşmeye',
    ['İki kutuplu dünya ve ittifaklar','Türkiye’nin çok partili hayatı ve dış ilişkileri','Küreselleşme, iletişim ve bölgesel krizler'],
    ['NATO ve Varşova Paktı üyelerini karıştırma','Küreselleşmeyi yalnız ekonomik süreç sayma','Dönem olaylarını kronolojik bloklara yanlış yerleştirme'],
    ['Olayı Soğuk Savaş öncesi/sonrası bağlamına koy','İç ve dış gelişmeler arasındaki ilişkiyi kur','Teknolojik değişimin siyasi ve kültürel sonuçlarını ayır'],
    'Harita, kronoloji ve kavram eşleştirmesiyle iki kutupluluktan çok merkezli düzene geçiş sorgulanır.');

  addProfile('Coğrafya','Doğal Sistemler ve Ekstrem Olaylar',
    ['Tehlike-risk-afet ayrımı','Ekstrem olay grafiği veya haritası','Kırılganlık ve zarar azaltma senaryosu'],
    ['Doğal olayı tek başına afet sayma','Tehlike büyüklüğü ile toplam riski özdeşleştirme','Tek bir hava olayını iklim eğiliminin kesin kanıtı sayma'],
    ['Tehlike, maruziyet ve kırılganlığı ayrı değerlendir','Haritanın ölçek ve gösterge birimini oku','Kısa olay ile uzun dönemli eğilimi ayır'],
    'Harita, tablo veya kent senaryosu üzerinden risk bileşenleri ve uygun önlem sorulur; yorum veriye dayanmalıdır.');
  addProfile('Coğrafya','Beşerî Sistemler ve Ekonomi',
    ['Nüfus-göç ve şehirleşme ilişkisi','Ekonomik faaliyet ve yer seçimi','Ulaşım, ticaret ve bölgesel gelişme'],
    ['Tek nedenli yer seçimi açıklaması','Nüfus yoğunluğu ile toplam nüfusu karıştırma','Ham madde yakınlığını her sanayi için zorunlu sayma'],
    ['Doğal ve beşerî etkenleri birlikte ele al','Harita verisini ölçekle yorumla','Neden, süreç ve sonucu üç ayrı halkada kur'],
    'Tematik harita veya ekonomik senaryo üzerinden mekânsal dağılış ve neden-sonuç ilişkisi çıkarılır.');
  addProfile('Coğrafya','Bölgeler ve Ülkeler',
    ['Mutlak-göreceli konum','Bölge ölçütü ve sınır değişimi','Jeopolitik veya gelişmişlik karşılaştırması'],
    ['Göreceli konumu değişmez sanma','Bölge sınırlarını idari sınırla özdeşleştirme','Gelişmişliği yalnız gelirle ölçme'],
    ['Soruda kullanılan bölge ölçütünü belirle','Konum sonucunu ulaşım ve ilişki ağıyla bağla','Karşılaştırmada birden çok gösterge kullan'],
    'Harita ve gösterge tablosu birlikte kullanılarak ülke/bölge ilişkileri, konum ve gelişmişlik yorumlatılır.');
  addProfile('Coğrafya','Çevre ve Toplum',
    ['Sürdürülebilir kaynak kullanımı','Çevresel etki ve havza yönetimi','Döngüsel ekonomi ve atık'],
    ['Geri dönüşümü tek çözüm sayma','Ekonomik yararı çevresel sürdürülebilirlikle özdeşleştirme','Yerel etkinin havza dışına taşmayacağını sanma'],
    ['Kararı çevre-ekonomi-toplum üçlüsüyle değerlendir','Kısa ve uzun dönem etkilerini ayır','Kaynağın yenilenme hızını kullanım hızıyla karşılaştır'],
    'Proje veya politika senaryosunda seçeneklerin çok ölçütlü karşılaştırılması ve en sürdürülebilir kararın gerekçelendirilmesi beklenir.');

  addProfile('Felsefe Grubu ve Din Kültürü','Bilgi, Varlık ve Ahlak Felsefesi',
    ['Parçadan felsefi yaklaşım çıkarma','Kavram-problem eşleştirme','Argümanın gerekçesini belirleme'],
    ['Filozof adından metni okumadan karar verme','Günlük anlam ile felsefi terimi karıştırma','Örnek ile ana iddiayı özdeşleştirme'],
    ['Önce temel iddia ve gerekçeyi ayır','Yaklaşımı anahtar kelime değil bütün düşünceyle eşleştir','Karşı görüşü de metinden belirle'],
    'Kısa bir felsefi parçada savunulan görüş, eleştirilen yaklaşım veya temel problem sorulur; kavramı bağlam içinde tanımak gerekir.');
  addProfile('Felsefe Grubu ve Din Kültürü','Psikoloji ve Sosyoloji',
    ['Araştırma yöntemi ve değişken','Öğrenme/algı süreçleri','Toplumsal kurum, rol ve sosyalleşme'],
    ['Korelasyonu nedensellik sayma','Ödül ile pekiştireci işlevinden bağımsız özdeşleştirme','Bireysel olayı yalnız toplumsal veya tersine açıklama'],
    ['Bağımlı-bağımsız değişkeni ölçülen sonuçtan ayır','Yöntemin sınırlılığını verilen veriye göre değerlendir','Analiz düzeyini birey/grup/kurum olarak işaretle'],
    'Deney, anket veya günlük yaşam senaryosu üzerinden yöntem, kavram ve çıkarım bağlantısı kurulur.');
  addProfile('Felsefe Grubu ve Din Kültürü','Mantık',
    ['Önerme ve doğruluk değeri','Çıkarımın geçerliliği','Bileşik önerme ve doğruluk tablosu'],
    ['Sonuç doğruysa çıkarım geçerlidir sanma','p→q ile q→p ifadelerini özdeşleştirme','Günlük dildeki “veya”yı her zaman dışlayıcı okuma'],
    ['Öncül ve sonucu sembolleştir','Geçerlilik ile öncüllerin gerçek doğruluğunu ayır','Karşı örnek için öncüller doğru sonuç yanlış satırı ara'],
    'Günlük dilde verilen akıl yürütme sembolik yapıya çevrilir; geçerlilik, eşdeğerlik veya tutarlılık sorulur.');
  addProfile('Felsefe Grubu ve Din Kültürü','Din, Ahlak ve Güncel Meseleler',
    ['Temel değer ve ilke çıkarımı','Güncel sorunlarda ahlaki değerlendirme','Dinî yorum ve kaynak ilişkisi'],
    ['Yarar gördüğü için tüm yöntemleri meşru sayma','Kişisel yorumu temel kaynak hükmü gibi sunma','Hak, niyet ve sonucu birbirinden koparma'],
    ['Metindeki ilkeyi somut davranışla ilişkilendir','Yarar-zarar yanında adalet ve hak boyutunu kontrol et','Kesin yargıyı verilen bilgi sınırında tut'],
    'Teknoloji, çevre, mahremiyet veya toplumsal sorumluluk bağlamında değerlerin nasıl uygulanacağı sorulur; çok boyutlu gerekçe beklenir.');

  /* QUESTION_PACKS */

  window.YKS2027_EXAM_GUIDE={
    buildId:'20260824-06',difficultyOrder:difficultyOrder,sources:sources,profiles:profiles,questions:questions
  };
})();
