# YKS2027 Arena — QA Report Mixed Core V6

## Parti özeti

- Dosya: `mixed_core_v6_50.json`
- Toplam soru: 50
- TYT: 30
- AYT: 20
- Tüm sorular: özgün, 5 seçenekli, tek doğru cevaplı ve kısa çözümlü
- Kapsam tabanı: MEB-TTKB 2026 YKS konu/kazanımları; 2027 resmî kapsamı yayımlandığında yeniden kontrol edilecek
- Stil tabanı: ÖSYM YKS soru mantığı; çıkmış soru metinleri kopyalanmadı

## Teknik QA

- 50/50 soru kaydı yapısal kontrolden geçti
- 50/50 soruda tam 5 seçenek var
- 50/50 `correctIndex` değeri 0–4 aralığında
- 50/50 ID benzersiz
- TYT/AYT dağılımı: 30/20
- 21 sayısal/işlemsel soru bağımsız ikinci hesap kontrolünden geçti

## İçerik QA

- Matematik, fizik ve yüzde/oran/olasılık hesapları ikinci kez çözüldü
- Fen sorularında temel kavram ve süreç eşleştirmeleri kontrol edildi
- Türkçe sorularında soru kökü ile seçenekler arasında tek doğru cevap koşulu kontrol edildi
- Tarih, coğrafya, felsefe, din ve edebiyat sorularında tartışmalı veya yoruma açık ikinci doğru seçenek bırakılmadı

## Yayın durumu

Bu parti `verified-baseline` statüsündedir. `needs2027Recheck=true` olarak kalır. 2027 resmî YKS konu-kazanım listesi yayımlandığında kapsam kontrolü tekrar yapılacaktır.
