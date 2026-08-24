# ARENA-CORE-V1 uyumu

Bu proje `ARENA-CORE-V1` ortak ürün çekirdeğini ve `ARENA-AI-TEACHER-V1` alt sözleşmesini kullanır.

- Uygulama ad alanı: `yks2027-arena`
- Sınav adaptörü: YKS 2027; TYT/AYT kuralları proje içinde kalır
- Ücretsiz sınır: günlük 50 soru ve en fazla 6 isteğe bağlı ödüllü reklam
- Üyelikler: Ücretsiz, Arena Premium, Arena Pro, Arena Pro+
- Veli/davet hakları üretimde sunucudan doğrulanır
- PWA aynı scope için tek service worker kullanır ve etkinleşirken sayfayı zorla yenilemez

Eski `yks2027-*` localStorage kayıtları korunur. Ortak çekirdek yalnız sürümlü yeni anahtarlar ekler.
