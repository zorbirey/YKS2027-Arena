(function(){
  function unit(title, summary, note){return {title:title, summary:summary, note:note};}
  function course(title, exam, icon, units){return {title:title, exam:exam, icon:icon, units:units};}
  window.YKS2027_COURSES={
    source:{
      label:'MEB-TTKB 2025-2026 ortaöğretim programları',
      url:'https://ttkb.meb.gov.tr/meb_iys_dosyalar/2025_05/20144001_202505.pdf',
      note:'2027 resmî YKS konu listesi yayımlandığında içerik kapsamı yeniden doğrulanmalıdır.'
    },
    scope:{
      TYT:['Türkçe','Temel Matematik','Geometri','Tarih','Coğrafya','Felsefe','Din Kültürü','Fizik','Kimya','Biyoloji'],
      AYT:['Matematik','Geometri','Türk Dili ve Edebiyatı','Tarih-1','Tarih-2','Coğrafya-1','Coğrafya-2','Felsefe Grubu','Din Kültürü','Fizik','Kimya','Biyoloji'],
      YDT:['İngilizce','Almanca','Fransızca','Arapça','Rusça']
    },
    courses:[
      course('Matematik','AYT','∑',[
        unit('Üstel ve Logaritmik Fonksiyonlar','Üstel fonksiyon büyüme ve azalmayı; logaritma ise üstel ilişkinin tersini ifade eder. Tanım koşulları ve taban kısıtları her işlemden önce kontrol edilir.','Logaritmada taban pozitif, 1’den farklı; iç ifade pozitiftir. Denklem çözerken bulunan değerleri mutlaka tanım kümesinde sınayın.'),
        unit('Diziler','Dizi, doğal sayılarla numaralanmış terimlerden oluşur. Aritmetik dizide ortak fark, geometrik dizide ortak çarpan sabittir.','Genel terimi yazmadan toplam formülüne geçmeyin. Soruda ilk terim ve artış biçimini ayrı ayrı işaretleyin.'),
        unit('Trigonometri','Açı ölçüleri, trigonometrik fonksiyonlar, özdeşlikler ve denklemler birim çember üzerinden ilişkilendirilir.','İşaretleri bölgeye göre belirleyin; özdeşlik ezberini birim çember kontrolüyle destekleyin.'),
        unit('Dönüşümler ve Analitik Geometri','Öteleme, dönme ve yansıma; koordinat düzleminde nokta ve doğruların yeni konumlarını açıklar.','Dönüşüm sırası sonucu değiştirir. Önce hangi eksenin ya da merkezin referans alındığını yazın.'),
        unit('Limit ve Süreklilik','Limit bir fonksiyonun bir noktaya yaklaşırken davranışını; süreklilik ise yaklaşım değeriyle fonksiyon değerinin uyumunu inceler.','Sağ ve sol limit eşit değilse iki taraflı limit yoktur. Süreklilik için limitin varlığı ve fonksiyon değerine eşitliği birlikte gerekir.'),
        unit('Türev','Türev anlık değişim oranı ve teğet eğimidir. Artma-azalma, ekstremum ve optimizasyon sorularında kullanılır.','Kritik noktayı bulmak yetmez; işaret tablosuyla maksimum-minimum türünü doğrulayın.'),
        unit('İntegral','Belirsiz integral türevin tersidir; belirli integral yönlü alanı ve birikimi gösterir.','Grafik eksenin altındaysa integral negatiftir. Geometrik alan sorusunda mutlak alan ile yönlü alanı karıştırmayın.')
      ]),
      course('Türk Dili ve Edebiyatı','AYT','A',[
        unit('Giriş ve Edebiyatın Bilimlerle İlişkisi','Edebiyatın tarih, psikoloji, sosyoloji ve felsefeyle ilişkisi; metnin oluştuğu dönem ve zihniyet üzerinden incelenir.','Eseri yalnız yazar adıyla değil dönem, tema, dil ve tür özellikleriyle birlikte kodlayın.'),
        unit('Hikâye','Cumhuriyet dönemi hikâyesinde toplumcu gerçekçi, bireyin iç dünyasını esas alan, modernist ve millî-dinî duyarlıklı çizgiler ayırt edilir.','Parçadaki anlatıcı, zaman kırılması, iç konuşma ve toplumsal çevre ipuçları sanat anlayışını gösterir.'),
        unit('Şiir','Cumhuriyet dönemi şiir toplulukları; biçim, dil, imge ve dünya görüşleri bakımından karşılaştırılır.','Şair-eser eşleştirmesini tek başına ezberlemeyin; şiir anlayışının iki ayırt edici özelliğini ekleyin.'),
        unit('Roman','1950 sonrası romanda toplumsal değişim, bireyin bunalımı, köy-kent çatışması ve modernist teknikler öne çıkar.','Bilinç akışı, iç monolog ve geriye dönüş tekniklerini anlatıcı türüyle karıştırmayın.'),
        unit('Tiyatro','Geleneksel Türk tiyatrosu ile modern tiyatronun yapı ve sahne özellikleri karşılaştırılır; Cumhuriyet dönemi eserleri değerlendirilir.','Dramatik metinde olay kadar sahne yönergeleri, çatışma ve diyalog örgüsü de belirleyicidir.'),
        unit('Deneme ve Eleştiri','Deneme öznel ve serbest düşünce akışına; eleştiri ise eser ya da sanatçıyı ölçütlerle değerlendirmeye dayanır.','Metnin bilgi vermesinden çok yazarın tutumuna bakın: kanıtlama zorunluluğu yoksa deneme olasılığı güçlenir.'),
        unit('Söylev ve Mülakat','Söylev topluluğu etkilemeyi, mülakat soru-cevap yoluyla bilgi ve görüş aktarmayı amaçlar.','Türü belirlerken hitap biçimi, konuşmacı-dinleyici ilişkisi ve soru-cevap yapısını izleyin.')
      ]),
      course('Fizik','AYT','F',[
        unit('Çembersel Hareket','Merkezcil ivme ve kuvvet hareketin yönünü değiştirir; hızın büyüklüğü sabit kalsa da hız vektörü değişir.','Merkezcil kuvvet yeni bir kuvvet türü değildir; merkeze yönelen net kuvvetin adıdır.'),
        unit('Basit Harmonik Hareket','Denge noktası çevresindeki periyodik hareket; genlik, periyot, frekans, hız ve ivme ilişkileriyle incelenir.','Uçlarda hız sıfır, ivme maksimum; denge noktasında hız maksimum, ivme sıfırdır.'),
        unit('Dalga Mekaniği','Kırınım, girişim ve Doppler olayı dalgaların ortam ve gözlemciyle etkileşimini açıklar.','Frekansı kaynak belirler; dalga hızı ortama bağlıdır. Ortam değişiminde bu ikisini ayırın.'),
        unit('Atom Fiziğine Giriş ve Radyoaktivite','Atom modelleri, enerji düzeyleri, tayf ve radyoaktif bozunmalar modern fiziğin temelini oluşturur.','Yarı ömür sabittir; kalan çekirdek miktarı her yarı ömürde yarıya iner, doğrusal azalmaz.'),
        unit('Modern Fizik','Özel görelilik, fotoelektrik olay, Compton saçılması ve madde dalgaları klasik fiziğin sınırlarını gösterir.','Fotoelektrikte eşik frekans maddeye bağlıdır; ışık şiddeti tek başına eşik altı fotonu etkili yapmaz.'),
        unit('Modern Fiziğin Teknolojideki Uygulamaları','Görüntüleme, yarı iletkenler, lazer, süperiletkenlik ve nanoteknoloji modern fizik ilkelerinin ürünüdür.','Uygulamayı soruda verilen temel ilkeyle eşleştirin; cihaz adını ezberlemek yerine enerji ve madde etkileşimini düşünün.')
      ]),
      course('Kimya','AYT','K',[
        unit('Kimya ve Elektrik','Redoks tepkimeleri, galvanik hücreler, elektroliz ve pil potansiyeli elektron alışverişi üzerinden açıklanır.','Anot her zaman yükseltgenme, katot her zaman indirgenmedir; işaret hücre türüne göre değişebilir.'),
        unit('Karbon Kimyasına Giriş','Karbonun hibritleşmesi, bağ yapısı, allotropları ve organik bileşiklerin gösterimleri incelenir.','Karbon sayısı aynı olsa bile bağlanma düzeni değişirse izomer oluşabilir.'),
        unit('Organik Bileşikler','Hidrokarbonlar ve fonksiyonel gruplar; adlandırma, özellik ve temel tepkimeleriyle ele alınır.','Önce ana zinciri, sonra fonksiyonel grubu ve numaralandırma yönünü belirleyin.'),
        unit('Enerji Kaynakları ve Bilimsel Gelişmeler','Fosil, nükleer ve yenilenebilir kaynaklar; verim, çevresel etki ve sürdürülebilirlik açısından karşılaştırılır.','Enerji kaynağını yalnız maliyetle değil karbon salımı, süreklilik ve depolama gereksinimiyle birlikte değerlendirin.')
      ]),
      course('Biyoloji','AYT','B',[
        unit('Genden Proteine','DNA’nın eşlenmesi, RNA sentezi, genetik kod ve protein sentezi kalıtsal bilginin ürüne dönüşümünü açıklar.','Replikasyon DNA→DNA, transkripsiyon DNA→RNA, translasyon RNA→protein akışıdır.'),
        unit('Canlılarda Enerji Dönüşümleri','Fotosentez, kemosentez ve hücresel solunumda enerji ve madde akışı karşılaştırılır.','ATP uzun süreli depo değildir; hücrede üretilir ve kısa sürede kullanılır.'),
        unit('Bitki Biyolojisi','Bitkisel dokular, taşıma, hormonlar, hareket ve üreme çevre koşullarıyla ilişkili biçimde incelenir.','Ksilem çoğunlukla su-mineral; floem organik besin taşır. Taşıma yönünü sorunun bağlamıyla kontrol edin.'),
        unit('Canlılar ve Çevre','Popülasyon dinamikleri, komünite ilişkileri, ekosistem dengesi ve insan etkisi ele alınır.','Enerji piramidinde yukarı çıkıldıkça kullanılabilir enerji azalır; madde ise döngülere katılır.')
      ]),
      course('T.C. İnkılap Tarihi ve Atatürkçülük','TYT / AYT','T',[
        unit('20. Yüzyıl Başlarında Osmanlı Devleti','Siyasi, askerî ve ekonomik gelişmeler Osmanlı Devleti’nin son dönemini ve Millî Mücadele ortamını hazırlar.','Olayları kronolojiyle birlikte neden-sonuç zincirine yerleştirin.'),
        unit('Millî Mücadele’nin Hazırlık Dönemi','Genelgeler, kongreler ve Temsil Heyeti millî egemenlik fikrini kurumsallaştırır.','Yerel başlayıp ulusala dönüşen kararlarla doğrudan ulusal kararları ayırın.'),
        unit('Kurtuluş Savaşı Cepheleri','Doğu, Güney ve Batı cephelerinin askerî ve diplomatik sonuçları karşılaştırılır.','Her cepheyi antlaşması ve kapanış sonucu ile birlikte eşleştirin.'),
        unit('Atatürk İlke ve İnkılapları','Siyasi, hukuk, eğitim, kültür ve ekonomi alanındaki dönüşümler temel ilkelerle ilişkilendirilir.','Bir inkılap birden fazla ilkeyle ilişkili olabilir; sorudaki amacı esas alın.'),
        unit('Atatürk Dönemi İç Politika','Çok partili hayata geçiş denemeleri, toplumsal düzenlemeler ve devlet yapılanması incelenir.','Tarih ile amaç bilgisini birlikte tutun; benzer kurum adlarını karıştırmayın.'),
        unit('Atatürk Dönemi Dış Politika','Musul, nüfus mübadelesi, Milletler Cemiyeti, Balkan Antantı, Montrö ve Hatay gelişmeleri değerlendirilir.','Sorunları çözüm tarihi, taraflar ve temel ilkeyle eşleştirin.'),
        unit('II. Dünya Savaşı ve Türkiye','Savaşın nedenleri, bloklar, sonuçlar ve Türkiye’nin denge politikası ele alınır.','Türkiye’nin savaş boyunca değişen diplomatik tutumunu dönemlere ayırın.'),
        unit('Soğuk Savaş’tan Küreselleşmeye','İki kutuplu sistem, bölgesel gelişmeler ve Türkiye’nin uluslararası konumu kronolojik olarak incelenir.','NATO, Varşova Paktı ve bölgesel örgütleri kuruluş amaçlarıyla eşleştirin.')
      ]),
      course('Coğrafya','TYT / AYT','C',[
        unit('Doğal Sistemler ve Ekstrem Olaylar','Doğa süreçleri, ekstrem hava olayları ve afet riskleri mekânsal dağılışlarıyla değerlendirilir.','Afet ile tehlikeyi ayırın; risk, tehlikenin nüfus ve varlıklarla etkileşimidir.'),
        unit('Beşerî Sistemler ve Ekonomi','Nüfus, yerleşme, üretim, ticaret, ulaşım ve hizmet sektörleri küresel bağlantılarıyla incelenir.','Harita sorularında tek veriye değil iklim, yer şekli, nüfus ve ulaşım ilişkisine bakın.'),
        unit('Bölgeler ve Ülkeler','Jeopolitik konum, gelişmişlik, enerji yolları ve bölgesel örgütler ülkeler arası ilişkileri açıklar.','Mutlak konum değişmez; göreceli konum ulaşım ve siyasi koşullarla farklılaşabilir.'),
        unit('Çevre ve Toplum','Doğal kaynak kullanımı, çevre sorunları, sürdürülebilirlik ve mekânsal planlama birlikte ele alınır.','Sürdürülebilir çözüm çevresel, ekonomik ve toplumsal boyutları aynı anda gözetir.')
      ]),
      course('Felsefe Grubu ve Din Kültürü','TYT / AYT','Ψ',[
        unit('Bilgi, Varlık ve Ahlak Felsefesi','Temel felsefi problemler; akıl yürütme, kavram ve görüş karşılaştırmalarıyla incelenir.','Görüşü filozof adıyla değil temel iddia ve gerekçesiyle tanıyın.'),
        unit('Psikoloji ve Sosyoloji','Davranış, öğrenme, gelişim, toplumsal yapı, kültür ve kurumlar bilimsel yaklaşım içinde değerlendirilir.','Bireysel açıklamayla toplumsal açıklamayı sorunun ölçeğine göre ayırın.'),
        unit('Mantık','Önerme, çıkarım, tutarlılık ve geçerlilik düşüncenin biçimsel yapısını analiz eder.','Bir çıkarımın sonucu doğru olabilir ama akıl yürütme geçersiz olabilir; biçimi kontrol edin.'),
        unit('Din, Ahlak ve Güncel Meseleler','İnanç, ibadet, ahlak, yorum gelenekleri ve güncel meseleler temel kaynaklar ve ilkeler bağlamında ele alınır.','Kavram sorularında ayet veya örnekte vurgulanan ana ilkeyi belirleyin.')
      ])
    ]
  };
})();
