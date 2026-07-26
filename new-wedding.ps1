<#
.SYNOPSIS
    Dijital Düğün Davetiyesi Otomatik Oluşturma Scripti (PowerShell)
#>

param(
    [string]$ConfigFile = ""
)

Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "   DIJITAL DUGUN DAVETIYESI OLUSTURMA SIHIRBAZI   " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host ""

# 1. JSON veya Etkileşimli Veri Alma
if ($ConfigFile -ne "" -and (Test-Path $ConfigFile)) {
    Write-Host "[+] JSON yapilandirma dosyasi okunuyor: $ConfigFile" -ForegroundColor Cyan
    $jsonContent = Get-Content -Raw -Path $ConfigFile -Encoding UTF8 | ConvertFrom-Json
    
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
    $scheduleJson = $jsonContent.schedule
    $storyTimelineJson = $jsonContent.storyTimeline
} else {
    Write-Host "[!] Lutfen yeni cift ve dugun detaylarini girin:" -ForegroundColor Yellow
    Write-Host ""
    $groomName = Read-Host "Damat Adi (Orn: Ercin)"
    $brideName = Read-Host "Gelin Adi (Orn: Merve)"
    $coupleInitials = Read-Host "Bas Harfler (Orn: E ve M)"
    $displayDate = Read-Host "Dugun Tarihi (Orn: 19 Eylul 2026, Cumartesi)"
    $displayTime = Read-Host "Dugun Saati (Orn: 19:00)"
    $weddingDate = Read-Host "Sayac Format Tarih (Orn: 2026-09-19T19:00:00)"
    $slogan = Read-Host "Dugun Slogani"
    $invitationText = Read-Host "Davetiye Metni"
    $venueName = Read-Host "Dugun Salonu / Mekan Adi"
    $venueAddress = Read-Host "Mekan Adresi"
    $venueCity = Read-Host "Sehir (Orn: Samsun)"
    $googleMapsUrl = Read-Host "Google Maps Linki"
    $appleMapsUrl = Read-Host "Apple Maps Linki"
    $giftMessage = Read-Host "Taki / Hediye Mesaji"
    $bankName = Read-Host "Banka Adi"
    $accountHolder = Read-Host "Hesap Sahibi Ad Soyad"
    $iban = Read-Host "IBAN Numarasi"
    $supabaseUrl = Read-Host "Supabase Project URL"
    $supabaseAnonKey = Read-Host "Supabase Publishable/Anon Key"
}

# Varsayilan Değer Kontrolleri
if (-not $groomName) { $groomName = "Ercin" }
if (-not $brideName) { $brideName = "Merve" }
if (-not $coupleInitials) { $coupleInitials = "$($groomName.Substring(0,1)) & $($brideName.Substring(0,1))" }
if (-not $weddingDate) { $weddingDate = "2026-09-19T19:00:00" }
if (-not $displayDate) { $displayDate = "19 Eylul 2026, Cumartesi" }
if (-not $displayTime) { $displayTime = "19:00" }
if (-not $slogan) { $slogan = "Bu guzel gunumuzde sizleri de aramizda gormekten mutluluk duyariz!" }
if (-not $invitationText) { $invitationText = "Dugunumuze hos geldiniz! Mutlulugumuza ortak olmaniz bizleri onurlandiracaktir." }
if (-not $venueName) { $venueName = "Gunes Dugun Salonu" }
if (-not $venueAddress) { $venueAddress = "19 Mayis, Fuar Cd. No:14, 55020 Ilkadim / Samsun" }
if (-not $venueCity) { $venueCity = "Samsun" }
if (-not $googleMapsUrl) { $googleMapsUrl = "https://maps.google.com" }
if (-not $appleMapsUrl) { $appleMapsUrl = "https://maps.apple.com" }
if (-not $giftMessage) { $giftMessage = "Hediye ve takilariniz icin banka hesap bilgilerimizi kullanabilirsiniz." }
if (-not $bankName) { $bankName = "Garanti BBVA" }
if (-not $accountHolder) { $accountHolder = "$groomName & $brideName Bilgin" }
if (-not $iban) { $iban = "TR00 0000 0000 0000 0000 0000 00" }

# Schedule Serialization
if ($scheduleJson) {
    $scheduleFormatted = ($scheduleJson | ConvertTo-Json -Depth 5 -Compress)
} else {
    $defaultSchedule = @(
        @{ time = "19:00"; title = "Karsilama & Kokteyl"; description = "Misafirlerimizin karsilanmasi ve canli muzik esliginde acilis kokteyli." },
        @{ time = "20:00"; title = "Nikah Toreni"; description = "Buyuk bulusma ve hayatlarimizi birlestirdigimiz o ozel an." },
        @{ time = "20:45"; title = "Dugun Yemegi"; description = "Zarif lezzetler ve sevdiklerimizle birlikte aksam yemegi." },
        @{ time = "22:00 - 01:00"; title = "Eglence & After Party"; description = "Gece boyunca surecek coskulu kutlama ve unutulmaz anlar." }
    )
    $scheduleFormatted = ($defaultSchedule | ConvertTo-Json -Depth 5 -Compress)
}

# StoryTimeline Serialization
if ($storyTimelineJson) {
    $timelineFormatted = ($storyTimelineJson | ConvertTo-Json -Depth 5 -Compress)
} else {
    $heartIcon = [char]0x2764 + [char]0xFE0F
    $coffeeIcon = [char]::ConvertFromUtf32(0x2615)
    $ringIcon = [char]::ConvertFromUtf32(0x1F48D)
    $brideIcon = [char]::ConvertFromUtf32(0x1F470)

    $defaultTimeline = @(
        @{ id = "1"; icon = $heartIcon; title = "Tanistik"; date = "2022"; description = "Hayatimizi degistiren ilk karsilasma." },
        @{ id = "2"; icon = $coffeeIcon; title = "Ilk Kahve"; date = "2023"; description = "Saatlerce suren tatli sohbetler ve unutulmaz bir bulusma." },
        @{ id = "3"; icon = $ringIcon; title = "Evlilik Teklifi"; date = "2025"; description = "Yildizlarin altinda sonsuzluga Evet dedigimiz an." },
        @{ id = "4"; icon = $brideIcon; title = "Dugun Gunu"; date = $displayDate; description = "Tum sevdiklerimizle bir araya geldigimiz en mutlu gunumuz." }
    )
    $timelineFormatted = ($defaultTimeline | ConvertTo-Json -Depth 5 -Compress)
}

Write-Host ""
Write-Host "[+] Davetiye verileri isleniyor..." -ForegroundColor Green

# 2. config/weddingConfig.ts Guncelleme
$tsCode = @"
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
  schedule: $scheduleFormatted,
  storyTimeline: $timelineFormatted,
  galleryPhotos: [
    {
      id: "g1",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
      caption: "Enchanting evening",
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
      caption: "Love in every glance",
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

$targetPath = [System.IO.Path]::Combine($PSScriptRoot, "config", "weddingConfig.ts")
[System.IO.File]::WriteAllText($targetPath, $tsCode, [System.Text.Encoding]::UTF8)
Write-Host "[OK] config/weddingConfig.ts guncellendi." -ForegroundColor Green

# 3. .env.local Guncelleme
if ($supabaseUrl -and $supabaseAnonKey) {
    $envLines = @(
        "# Supabase Project Configuration",
        "NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabaseAnonKey"
    )
    $envPath = [System.IO.Path]::Combine($PSScriptRoot, ".env.local")
    [System.IO.File]::WriteAllLines($envPath, $envLines, [System.Text.Encoding]::UTF8)
    Write-Host "[OK] .env.local guncellendi." -ForegroundColor Green
}

# 4. Otomatik Git Commit & Push
Write-Host ""
$commitChoice = Read-Host "Bu degisiklikleri GitHub'a otomatik yuklemek ister misiniz? (E/H)"
if ($commitChoice -eq "E" -or $commitChoice -eq "e") {
    Write-Host "[+] GitHub'a yukleniyor..." -ForegroundColor Cyan
    git add .
    git commit -m "feat: yeni davetiye olusturuldu - $groomName & $brideName"
    git push origin main
    Write-Host "[OK] Basariyla GitHub'a yuklendi! GitHub Actions yayini 1 dakika icinde guncelleyecektir." -ForegroundColor Green
}

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "   YENI DUGUN DAVETIYESI BASARIYLA HAZIRLANDI " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "Gelin ve Damat : $groomName ve $brideName" -ForegroundColor White
Write-Host "Tarih          : $displayDate" -ForegroundColor White
Write-Host "Mekan          : $venueName" -ForegroundColor White
Write-Host ""
Write-Host "Sayfanin en altindaki 'Davetiye QR Kodunu Olustur ve Indir' butonunu kullanarak" -ForegroundColor Yellow
Write-Host "yeni cift icin yuksek cozunurluklu QR Kodu indirebilir ve matbaaya gonderebilirsiniz." -ForegroundColor Yellow
Write-Host ""
