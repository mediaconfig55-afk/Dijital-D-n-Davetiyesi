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
  brideName: "Zeynep",
  groomName: "Burak",
  coupleInitials: "B & Z",
  weddingDate: "2026-10-10T19:00:00",
  displayDate: "10 Ekim 2026, Cumartesi",
  displayTime: "19:00",
  slogan: "Sevginin ve mutluluÄŸun bir Ã¶mÃ¼r sÃ¼receÄŸi bu Ã¶zel gÃ¼nde buluÅŸalÄ±m.",
  invitationText: "HayatÄ±mÄ±zÄ±n en anlamlÄ± gÃ¼nÃ¼nde, sevgimizi ve geleceÄŸimizi taÃ§landÄ±rÄ±rken sizleri de aramÄ±zda gÃ¶rmekten mutluluk duyacaÄŸÄ±z.",
  venue: {
    name: "SwissÃ´tel The Bosphorus",
    address: "ViÅŸnezade, AcÄ±su Sk. No:19, BeÅŸiktaÅŸ / Ä°stanbul",
    city: "Ä°stanbul",
    googleMapsUrl: "https://maps.google.com/?q=Swissotel+The+Bosphorus+Istanbul",
    appleMapsUrl: "https://maps.apple.com/?q=Swissotel+The+Bosphorus+Istanbul",
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
      date: "10 Ekim 2026, Cumartesi",
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
    message: "DÃ¼ÄŸÃ¼n hediyeleriniz ve takÄ±larÄ±nÄ±z iÃ§in banka hesap bilgilerimizi kullanabilirsiniz.",
    bankAccounts: [
      {
        bankName: "Garanti BBVA",
        accountHolder: "Burak & Zeynep YÄ±lmaz",
        iban: "TR56 0006 2000 0000 9999 8888 77",
        logoText: "Garanti BBVA",
      },
    ],
  },
  audioUrl: "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-piano-1107.mp3",
  isPostWeddingMode: false,
};
