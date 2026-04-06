import arrowDown from "@/assets/icons/arrow-down.png";
import arrowUp from "@/assets/icons/arrow-up.png";
import backArrow from "@/assets/icons/back-arrow.png";
import chat from "@/assets/icons/chat.png";
import checkmark from "@/assets/icons/check.png";
import close from "@/assets/icons/close.png";
import dollar from "@/assets/icons/dollar.png";
import email from "@/assets/icons/email.png";
import eyecross from "@/assets/icons/eyecross.png";
import google from "@/assets/icons/google.png";
import home from "@/assets/icons/home.png";
import list from "@/assets/icons/list.png";
import lock from "@/assets/icons/lock.png";
import map from "@/assets/icons/map.png";
import marker from "@/assets/icons/marker.png";
import out from "@/assets/icons/out.png";
import person from "@/assets/icons/person.png";
import pin from "@/assets/icons/pin.png";
import point from "@/assets/icons/point.png";
import profile from "@/assets/icons/profile.png";
import search from "@/assets/icons/search.png";
import selectedMarker from "@/assets/icons/selected-marker.png";
import star from "@/assets/icons/star.png";
import target from "@/assets/icons/target.png";
import to from "@/assets/icons/to.png";
import Logo from "@/assets/images/hahu_logo.png";
import On2 from "@/assets/images/on2.png";
import On3 from "@/assets/images/on3.png";
import On4 from "@/assets/images/on4.png";

export const icons = {
  arrowDown,
  arrowUp,
  backArrow,
  chat,
  checkmark,
  close,
  dollar,
  email,
  eyecross,
  google,
  home,
  list,
  lock,
  map,
  marker,
  out,
  person,
  pin,
  point,
  profile,
  search,
  selectedMarker,
  star,
  target,
  to,
};
 export const LOCAL_AVATARS = [
    { id: '1', source: require('../assets/images/hahu_logo.png') },
    { id: '2', source: require('../assets/images/on2.png') },
    { id: '3', source: require('../assets/images/on3.png') },
  ];
export const images={
  Logo,
  On3,
  On2,
  On4,


}
export const onboardingData = [
  {
    id: 1,
    title: "Welcome to Hahu Lallije",
    description:
      "Help your child learn Amharic letters, numbers, and words in a fun and interactive way.",
    image:images.Logo,
  },
  {
    id: 2,
    title: "Fun & Interactive Learning",
    description:
      "Games, sounds, and stories designed to make learning enjoyable for your child.",
    image: images.On2,
  },
  {
    id: 3,
    title: "Track Your Child’s Progress",
    description:
      "Monitor learning progress, achievements, and daily activity easily.",
    image: images.On3,
  },
  {
    id: 4,
    title: "Parental Control & Safety",
    description:
      "Manage your child’s learning safely.",
    image: images.On4,
  },
];
export const subplans = [
    
    {
      id: "2",
      name: "Premium",
      priceMonthly: 250,
      priceYearly: 2500,
      desc: "All features unlocked",
      badge: "Popular",
      colors: ["#3A5F6B", "#2F4F5A"], 
      popular: true,
    },
    {
      id: "3",
      name: "Ultimate",
      priceMonthly: 400,
      priceYearly: 4000,
      desc: "Advanced + analytics",
      badge: "Best Value",
      colors: ["#4A3C5E", "#3A2F4C"], 
      popular: false,
    },
  ];

export const SUBJECTS = [
  { id: 'story', label: 'Story Reading', icon: 'book-outline' },
  { id: 'picture to word', label: 'Picture to Word', icon: 'image-outline' },
  { id: 'fidel tracing', label: 'Fidel Tracing', icon: 'pencil-outline' },
  { id: 'word builder', label: 'Word Builder', icon: 'construct-outline' },
  { id: 'fill in the blank', label: 'Fill in the Blank', icon: 'create-outline' },
  { id: 'pronouncation', label: 'Pronunciation', icon: 'volume-high-outline' },
  { id: 'voice/fidel to word game', label: 'Voice to Word', icon: 'mic-outline' },
] 