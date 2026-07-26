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
  brideName: "Merve",
  groomName: "Erçin",
  coupleInitials: "M & E",
  weddingDate: "2026-09-19T19:00:00",
  displayDate: "19 Eylül 2026 Cumartesi",
  displayTime: "19:00",
  slogan: "Bu güzel Günümüzde Sizleride Aramızda Görmekten Mutluluk Duyarız...!",
  invitationText: "Düğünümüze Hoş Geldiniz...!",
  venue: {
    name: "Güneş Düğün Salonu",
    address: "Güneş Düğün Salonu, 19 Mayıs, Fuar Cd. No:14, 55020 İlkadım/Samsun",
    city: "Samsun Fuar İçi",
    googleMapsUrl: "google.com/maps/place//data=!4m2!3m1!1s0x408877db47e82e8b:0xebf511a89020842d?sa=X&ved=1t:8290&ictx=111",
    appleMapsUrl: "google.com/maps/place//data=!4m2!3m1!1s0x408877db47e82e8b:0xebf511a89020842d?sa=X&ved=1t:8290&ictx=111",
  },
  schedule: [
    {
      time: "19:00",
      title: "Karsilama & Kokteyl",
      description: "Misafirlerimizin karsilanmasi ve canli muzik esliginde acilis kokteyli.",
    },
    {
      time: "20:00",
      title: "Nikah Toreni",
      description: "Buyuk bulusma ve hayatlarimizi birlestirdigimiz o ozel an.",
    },
    {
      time: "20:45",
      title: "Dugun Yemegi",
      description: "Zarif lezzetler ve sevdiklerimizle birlikte aksam yemegi.",
    },
    {
      time: "22:00 - 01:00",
      title: "Eglence & After Party",
      description: "Gece boyunca surecek coskulu kutlama ve unutulmaz anlar.",
    },
  ],
  storyTimeline: [
    {
      id: "1",
      icon: "â¤ï¸",
      title: "Tanistik",
      date: "2022",
      description: "Hayatimizi degistiren ilk karsilasma.",
    },
    {
      id: "2",
      icon: "â˜•",
      title: "Ilk Kahve",
      date: "2023",
      description: "Saatlerce sureen tatli sohbetler ve unutulmaz bir bulusma.",
    },
    {
      id: "3",
      icon: "ğŸ’",
      title: "Evlilik Teklifi",
      date: "2025",
      description: "Yildizlarin altinda sonsuzluga 'Evet' dedigimiz an.",
    },
    {
      id: "4",
      icon: "ğŸ‘°",
      title: "Dugun Gunu",
      date: "19 Eylül 2026 Cumartesi",
      description: "Tum sevdiklerimizle bir araya geldigimiz en mutlu gunumuz.",
    },
  ],
  galleryPhotos: [
    {
      id: "g1",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
      caption: "Buyulu bir aksamdan",
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
      caption: "Askla bakislar",
      aspectRatio: "portrait",
    },
  ],
  giftInfo: {
    message: "Pamuk Eller İban Bilgilerine !",
    bankAccounts: [
      {
        bankName: "Garanti",
        accountHolder: "Emre Bilgin",
        iban: "TR0000-0000-0000-0000-0000",
        logoText: "Garanti",
      },
    ],
  },
  audioUrl: "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-piano-1107.mp3",
  isPostWeddingMode: false,
};
