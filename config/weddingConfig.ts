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
  brideName: "Esma",
  groomName: "Murat",
  coupleInitials: "M & E",
  weddingDate: "2026-08-20T19:00:00",
  displayDate: "20 Ağustos 2026, Cumartesi",
  displayTime: "19:00",
  slogan: "Bu güzel günümüzde sizleri de aramızda görmekten mutluluk duyarız!",
  invitationText: "Düğünümüze hoş geldiniz! Mutluluğumuza ortak olmanız bizleri onurlandıracaktır.",
  venue: {
    name: "Güneş Düğün Salonu",
    address: "19 Mayıs, Fuar Cd. No:14, 55020 İlkadım / Samsun",
    city: "Samsun",
    googleMapsUrl: "https://maps.google.com/?q=Gunes+Dugun+Salonu+Samsun",
    appleMapsUrl: "https://maps.apple.com/?q=Gunes+Dugun+Salonu+Samsun",
  },
  schedule: [{"time":"19:00","title":"Salon Kapı Açılış","description":"Misafirlerimizin karşılanması ve canlı müzik eşliğinde açılış kokteyli."},{"time":"20:30","title":"Düğün Başlangıç","description":"Büyük buluşma ve hayatlarımızı birleştirdiğimiz o özel an."},{"time":"21:30","title":"Pasta Kesimi","description":"Zarif lezzetler ve sevdiklerimizle birlikte akşam yemeği."},{"time":"22:00 - 01:00","title":"Eğlence \u0026 After Party","description":"Gece boyunca sürecek coşkulu kutlama ve unutulmaz anlar."}],
  storyTimeline: [{"id":"1","icon":"❤️","title":"Tanıştık","date":"2022","description":"Hayatımızı değiştiren ilk karşılaşma."},{"id":"2","icon":"☕","title":"İlk Kahve","date":"2023","description":"Saatlerce süren tatlı sohbetler ve unutulmaz bir buluşma."},{"id":"3","icon":"💍","title":"Evlilik Teklifi","date":"2025","description":"Yıldızların altında sonsuzluğa \u0027Evet\u0027 dediğimiz an."},{"id":"4","icon":"👰","title":"Düğün Günü","date":"19 Eylül 2026","description":"Tüm sevdiklerimizle bir araya geldiğimiz en mutlu günümüz."}],
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
    message: "Düğün hediyeleriniz ve takılarınız için banka hesap bilgilerimizi kullanabilirsiniz.",
    bankAccounts: [
      {
        bankName: "Garanti BBVA",
        accountHolder: "Erçin & Merve Bilgin",
        iban: "TR00 0000 0000 0000 0000 0000 00",
        logoText: "Garanti BBVA",
      },
    ],
  },
  audioUrl: "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-piano-1107.mp3",
  isPostWeddingMode: false,
};