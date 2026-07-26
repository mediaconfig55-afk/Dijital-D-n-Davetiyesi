/**
 * Centralized Wedding Configuration
 * All contents, names, dates, maps, IBANs, and flags can be edited here easily.
 */

export interface StoryTimelineItem {
  id: string;
  icon: string; // Emoji or Icon identifier
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
  weddingDate: string; // YYYY-MM-DD THH:mm:ss format for Countdown
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
    coordinates?: {
      lat: number;
      lng: number;
    };
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
  audioUrl?: string; // Optional background music URL
  isPostWeddingMode: boolean; // Toggle true to turn page into post-wedding memory page
}

export const weddingConfig: WeddingConfig = {
  brideName: "Ayşe",
  groomName: "Emre",
  coupleInitials: "E & A",
  weddingDate: "2026-09-19T19:00:00",
  displayDate: "19 Eylül 2026, Cumartesi",
  displayTime: "19:00",
  slogan: "Birlikte sonsuzluğa ilk adımımızı atıyoruz.",
  invitationText: "Hayatımızın en özel gününde, mutluluğumuza ve ortak geleceğimizin ilk gününe tanıklık etmeniz bizleri onurlandıracaktır.",
  venue: {
    name: "Ciragan Palace Kempinski",
    address: "Yıldız, Çırağan Cd. No:32, Beşiktaş / İstanbul",
    city: "İstanbul",
    googleMapsUrl: "https://maps.google.com/?q=Ciragan+Palace+Kempinski+Istanbul",
    appleMapsUrl: "https://maps.apple.com/?q=Ciragan+Palace+Kempinski+Istanbul",
  },
  schedule: [
    {
      time: "19:00",
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
      date: "14 Mayıs 2021",
      description: "Ortak dostlarımızın vesilesiyle başlayan ve hayatımızı değiştiren ilk karşılaşma.",
    },
    {
      id: "2",
      icon: "☕",
      title: "İlk Kahve",
      date: "22 Mayıs 2021",
      description: "Saatlerce süren tatlı sohbetler ve unutulmaz bir akşamüstü buluşması.",
    },
    {
      id: "3",
      icon: "💍",
      title: "Evlilik Teklifi",
      date: "14 Şubat 2025",
      description: "Yıldızların altında, sonsuzluğa 'Evet' dediğimiz o büyüleyici an.",
    },
    {
      id: "4",
      icon: "👰",
      title: "Düğün Günü",
      date: "19 Eylül 2026",
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
    {
      id: "g4",
      url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80",
      caption: "Birlikte her mevsim",
      aspectRatio: "square",
    },
    {
      id: "g5",
      url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1000&q=80",
      caption: "Teklif günümüz",
      aspectRatio: "landscape",
    },
    {
      id: "g6",
      url: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1000&q=80",
      caption: "Sonsuz tebessüm",
      aspectRatio: "portrait",
    },
  ],
  giftInfo: {
    message: "Düğün hediyeniz veya takılarınız için banka hesap bilgilerimizi kullanabilirsiniz. Nazik düşünceleriniz için teşekkür ederiz.",
    bankAccounts: [
      {
        bankName: "Garanti BBVA",
        accountHolder: "Emre & Ayşe Yılmaz",
        iban: "TR56 0006 2000 0000 1234 5678 90",
        logoText: "GARANTİ",
      },
      {
        bankName: "Türkiye İş Bankası",
        accountHolder: "Emre Yılmaz",
        iban: "TR12 0006 4000 0000 9876 5432 10",
        logoText: "İŞ BANKASI",
      },
    ],
  },
  audioUrl: "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-piano-1107.mp3",
  isPostWeddingMode: false, // Set true after wedding to turn site into Memory Album
};
