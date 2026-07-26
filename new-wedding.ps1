<#
.SYNOPSIS
    Dijital Düğün Davetiyesi Otomatik Oluşturma ve Yapılandırma Scripti (PowerShell)

.DESCRIPTION
    Bu script, yeni bir çift için düğün davetiyesi bilgilerini alarak config/weddingConfig.ts
    ve .env.local dosyalarını otomatik günceller, projeyi derler ve GitHub/Vercel canlısına hazırlar.

.EXAMPLE
    .\new-wedding.ps1
    (Etkileşimli konsol sorularıyla yeni davetiye oluşturur)

.EXAMPLE
    .\new-wedding.ps1 -ConfigFile .\wedding-data.example.json
    (Hazır JSON dosyasından okuyarak saniyeler içinde davetiye üretir)
#>

param(
    [string]$ConfigFile = ""
)

Write-Host "==========================================================" -ForegroundColor Gold
Write-Host "   DİJİTAL DÜĞÜN DAVETİYESİ OLUŞTURMA SİHRİLİ SCRİPTİ   " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Gold
Write-Host ""

# 1. JSON veya Etkileşimli Veri Alma
if ($ConfigFile -ne "" -and (Test-Path $ConfigFile)) {
    Write-Host "[+] JSON yapılandırma dosyası okunuyor: $ConfigFile" -ForegroundColor Cyan
    $jsonContent = Get-Content -Raw -Path $ConfigFile | ConvertFrom-Json
    
    $brideName = $jsonContent.brideName
    $groomName = $jsonContent.groomName
    $coupleInitials = $jsonContent.coupleInitials
    $weddingDate = $jsonContent.weddingDate
    $displayDate = $jsonContent.displayDate
    $displayTime = $jsonContent.displayTime
    $slogan = $jsonContent.slogan
    $invitationText = $jsonContent.invitationText
    $venueName = $jsonContent.venue.name
    $venueAddress = $jsonContent.venue.address
    $venueCity = $jsonContent.venue.city
    $googleMapsUrl = $jsonContent.venue.googleMapsUrl
    $appleMapsUrl = $jsonContent.venue.appleMapsUrl
    $giftMessage = $jsonContent.giftInfo.message
    $bankName = $jsonContent.giftInfo.bankAccounts[0].bankName
    $accountHolder = $jsonContent.giftInfo.bankAccounts[0].accountHolder
    $iban = $jsonContent.giftInfo.bankAccounts[0].iban
    $supabaseUrl = $jsonContent.supabaseUrl
    $supabaseAnonKey = $jsonContent.supabaseAnonKey
} else {
    Write-Host "[!] Lütfen yeni çift ve düğün detaylarını girin:" -ForegroundColor Yellow
    Write-Host ""
    $groomName = Read-Host "Damat Adı (Örn: Emre)"
    $brideName = Read-Host "Gelin Adı (Örn: Ayşe)"
    $coupleInitials = Read-Host "Baş Harfler (Örn: E & A)"
    $displayDate = Read-Host "Düğün Tarihi (Örn: 19 Eylül 2026, Cumartesi)"
    $displayTime = Read-Host "Düğün Saati (Örn: 19:00)"
    $weddingDate = Read-Host "Sayaç Formatı Tarih (Örn: 2026-09-19T19:00:00)"
    $slogan = Read-Host "Düğün Sloganı"
    $invitationText = Read-Host "Davetiye Metni"
    $venueName = Read-Host "Düğün Salonu/Mekan Adı"
    $venueAddress = Read-Host "Mekan Adresi"
    $venueCity = Read-Host "Şehir (Örn: İstanbul)"
    $googleMapsUrl = Read-Host "Google Maps Linki"
    $appleMapsUrl = Read-Host "Apple Maps Linki"
    $giftMessage = Read-Host "Takı/Hediye Mesajı"
    $bankName = Read-Host "Banka Adı"
    $accountHolder = Read-Host "Hesap Sahibi Ad Soyad"
    $iban = Read-Host "IBAN Numarası"
    $supabaseUrl = Read-Host "Supabase Project URL"
    $supabaseAnonKey = Read-Host "Supabase Publishable/Anon Key"
}

# Varsayılan Değer Kontrolleri
if (-not $groomName) { $groomName = "Emre" }
if (-not $brideName) { $brideName = "Ayşe" }
if (-not $coupleInitials) { $coupleInitials = "$($groomName.Substring(0,1)) & $($brideName.Substring(0,1))" }
if (-not $weddingDate) { $weddingDate = "2026-09-19T19:00:00" }
if (-not $displayDate) { $displayDate = "19 Eylül 2026, Cumartesi" }
if (-not $displayTime) { $displayTime = "19:00" }
if (-not $slogan) { $slogan = "Birlikte sonsuzluğa ilk adımımızı atıyoruz." }
if (-not $invitationText) { $invitationText = "Hayatımızın en özel gününde, mutluluğumuza tanıklık etmeniz bizleri onurlandıracaktır." }
if (-not $venueName) { $venueName = "Çırağan Palace Kempinski" }
if (-not $venueAddress) { $venueAddress = "Beşiktaş / İstanbul" }
if (-not $venueCity) { $venueCity = "İstanbul" }
if (-not $googleMapsUrl) { $googleMapsUrl = "https://maps.google.com" }
if (-not $appleMapsUrl) { $appleMapsUrl = "https://maps.apple.com" }
if (-not $giftMessage) { $giftMessage = "Hediye ve takılarınız için banka hesap bilgilerimizi kullanabilirsiniz." }
if (-not $bankName) { $bankName = "Garanti BBVA" }
if (-not $accountHolder) { $accountHolder = "$groomName & $brideName Yılmaz" }
if (-not $iban) { $iban = "TR56 0006 2000 0000 1234 5678 90" }

Write-Host ""
Write-Host "[+] Davetiye verileri işleniyor..." -ForegroundColor Green

# 2. config/weddingConfig.ts Güncelleme
$configContent = @"
import { WeddingConfig } from './weddingConfig';

export interface StoryTimelineItem {
  id: string;
  icon: string;
  title: string;
  date: string;
  description: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
}

export interface BankAccount {
  bankName: string;
  accountHolder: string;
  iban: string;
  logoText?: string;
}

export interface WeddingConfig {
  brideName: string;
  groomName: string;
  coupleInitials: string;
  weddingDate: string;
  displayDate: string;
  displayTime: string;
  slogan: string;
  invitationText: string;
  venue: {
    name: string;
    address: string;
    city: string;
    googleMapsUrl: string;
    appleMapsUrl: string;
  };
  schedule: Array<{
    time: string;
    title: string;
    description: string;
  }>;
  storyTimeline: StoryTimelineItem[];
  galleryPhotos: GalleryPhoto[];
  giftInfo: {
    message: string;
    bankAccounts: BankAccount[];
  };
  audioUrl?: string;
  isPostWeddingMode: boolean;
}

export const weddingConfig: WeddingConfig = {
  brideName: "$brideName",
  groomName: "$groomName",
  coupleInitials: "$coupleInitials",
  weddingDate: "$weddingDate",
  displayDate: "$displayDate",
  displayTime: "$displayTime",
  slogan: "$slogan",
  invitationText: "$invitationText",
  venue: {
    name: "$venueName",
    address: "$venueAddress",
    city: "$venueCity",
    googleMapsUrl: "$googleMapsUrl",
    appleMapsUrl: "$appleMapsUrl",
  },
  schedule: [
    {
      time: "$displayTime",
      title: "Karşılama & Kokteyl",
      description: "Misafirlerimizin karşılanması ve canlı müzik eşliğinde açılış kokteyli.",
    },
    {
      time: "20:00",
      title: "Nikah Töreni",
      description: "Büyük buluşma ve hayatlarımızı birleştirdiğimiz o özel an.",
    },
    {
      time: "20:45",
      title: "Düğün Yemeği",
      description: "Zarif lezzetler ve sevdiklerimizle birlikte akşam yemeği.",
    },
    {
      time: "22:00 - 01:00",
      title: "Eğlence & After Party",
      description: "Gece boyunca sürecek coşkulu kutlama ve unutulmaz anlar.",
    },
  ],
  storyTimeline: [
    {
      id: "1",
      icon: "❤️",
      title: "Tanıştık",
      date: "2022",
      description: "Hayatımızı değiştiren ilk karşılaşma.",
    },
    {
      id: "2",
      icon: "☕",
      title: "İlk Kahve",
      date: "2023",
      description: "Saatlerce süren tatlı sohbetler ve unutulmaz bir buluşma.",
    },
    {
      id: "3",
      icon: "💍",
      title: "Evlilik Teklifi",
      date: "2025",
      description: "Yıldızların altında sonsuzluğa 'Evet' dediğimiz an.",
    },
    {
      id: "4",
      icon: "👰",
      title: "Düğün Günü",
      date: "$displayDate",
      description: "Tüm sevdiklerimizle bir araya geldiğimiz en mutlu günümüz.",
    },
  ],
  galleryPhotos: [
    {
      id: "g1",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
      caption: "Büyülü bir akşamdan",
      aspectRatio: "portrait",
    },
    {
      id: "g2",
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80",
      caption: "Unutulmaz anlar",
      aspectRatio: "landscape",
    },
    {
      id: "g3",
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80",
      caption: "Aşkla bakışlar",
      aspectRatio: "portrait",
    },
  ],
  giftInfo: {
    message: "$giftMessage",
    bankAccounts: [
      {
        bankName: "$bankName",
        accountHolder: "$accountHolder",
        iban: "$iban",
        logoText: "$bankName",
      },
    ],
  },
  audioUrl: "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-piano-1107.mp3",
  isPostWeddingMode: false,
};
"@

Set-Content -Path "config/weddingConfig.ts" -Value $configContent -Encoding UTF8
Write-Host "[✓] config/weddingConfig.ts güncellendi." -ForegroundColor Green

# 3. .env.local Güncelleme
if ($supabaseUrl -and $supabaseAnonKey) {
    $envContent = @"
NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl
NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabaseAnonKey
"@
    Set-Content -Path ".env.local" -Value $envContent -Encoding UTF8
    Write-Host "[✓] .env.local güncellendi." -ForegroundColor Green
}

# 4. Otomatik Git Commit ve Push (İsteğe Bağlı)
Write-Host ""
$commitChoice = Read-Host "Bu değişiklikleri GitHub'a otomatik yüklemek ister misiniz? (E/H)"
if ($commitChoice -eq "E" -or $commitChoice -eq "e") {
    Write-Host "[+] GitHub'a yükleniyor..." -ForegroundColor Cyan
    git add .
    git commit -m "feat: yeni davetiye olusturuldu - $groomName & $brideName"
    git push origin main
    Write-Host "[✓] Başarıyla GitHub'a yüklendi! GitHub Actions yayını 1 dakika içinde güncelleyecektir." -ForegroundColor Green
}

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Gold
Write-Host "   TEBRİKLER! YENİ DÜĞÜN DAVETİYESİ BAŞARIYLA HAZIRLANDI " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Gold
Write-Host "Gelin & Damat : $groomName & $brideName" -ForegroundColor White
Write-Host "Tarih         : $displayDate" -ForegroundColor White
Write-Host "Mekan         : $venueName" -ForegroundColor White
Write-Host ""
Write-Host "Sayfanın en altındaki 'Davetiye QR Kodunu Oluştur & İndir' butonunu kullanarak" -ForegroundColor Yellow
Write-Host "yeni çift için yüksek çözünürlüklü QR Kodu indirebilir ve matbaaya gönderebilirsiniz." -ForegroundColor Yellow
Write-Host ""
