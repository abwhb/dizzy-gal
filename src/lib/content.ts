/**
 * Copy and data for the Voyages Cortoba landing page.
 *
 * The page follows the Vita Travels design language section for section,
 * with the agency's own content. Facts (address, permit number, phone
 * numbers, the December 2026 Omra pricing) come from the agency's public
 * listings; prices marked `null` were not published at the time of writing
 * and render as "Tarif à venir" until confirmed.
 */

/* ------------------------------------------------------------------ */
/* Photography                                                          */
/* ------------------------------------------------------------------ */

export type Credit = {
  /** Path under `public/`. */
  src: string;
  /** What the photo shows, for alt text and the credits list. */
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  /** The Wikimedia Commons file page the photo was taken from. */
  page: string;
};

/**
 * Freely licensed photographs from Wikimedia Commons, downloaded, cropped to
 * each slot's aspect ratio and stored in `public/photos/`. Every licence
 * requires attribution, which the footer renders from this list. Replace any
 * entry with the agency's own photo by swapping the file and, if the credit
 * no longer applies, removing the entry's author and licence.
 */
export const photos = {
  hero: {
    src: "/photos/hero.jpg",
    title: "Tawaf autour de la Kaaba pendant le Hajj",
    author: "Adli Wahid",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    page: "https://commons.wikimedia.org/wiki/File:The_Kaaba_during_Hajj_-_edited.jpg",
  },
  omra: {
    src: "/photos/cat-omra.jpg",
    title: "La Kaaba, Masjid al-Haram",
    author: "Richard Mortel",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    page: "https://commons.wikimedia.org/wiki/File:The_Ka%27ba,_Great_Mosque_of_Mecca,_Saudi_Arabia_(4).jpg",
  },
  hajj: {
    src: "/photos/cat-hajj.jpg",
    title: "Pèlerins au mont Arafat (Jabal ar-Rahmah)",
    author: "Fahad Faisal",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    page: "https://commons.wikimedia.org/wiki/File:Jabal-e-Rehmat_(Mount_of_Mercy_Mount_Arafat).jpg",
  },
  voyages: {
    src: "/photos/cat-voyages.jpg",
    title: "Lanternes du souk Haddadine, Marrakech",
    author: "Petar Milošević",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    page: "https://commons.wikimedia.org/wiki/File:Oriental_hanging_lanterns._Souk_Haddadine,_Marrakech_Medina,_Morocco.jpg",
  },
  about: {
    src: "/photos/about.jpg",
    title: "Masjid an-Nabawi à l'heure dorée, Médine",
    author: "Tevfik Teker",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    page: "https://commons.wikimedia.org/wiki/File:Al-Masjid_al-Nabawi_-_panoramio_(2).jpg",
  },
  decembre: {
    src: "/photos/dep-decembre.jpg",
    title: "Le dôme vert de Masjid an-Nabawi",
    author: "بلال الدويك",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    page: "https://commons.wikimedia.org/wiki/File:Green_Dome_2.jpg",
  },
  octobre: {
    src: "/photos/dep-octobre.jpg",
    title: "Tour de l'horloge, La Mecque",
    author: "King Eliot",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    page: "https://commons.wikimedia.org/wiki/File:Makkah_Royal_Clock_Tower_in_2012.jpg",
  },
  istanbul: {
    src: "/photos/dep-istanbul.jpg",
    title: "Sainte-Sophie, Istanbul",
    author: "Arild Vågen",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    page: "https://commons.wikimedia.org/wiki/File:Hagia_Sophia_Mars_2013.jpg",
  },
  ramadan: {
    src: "/photos/dep-ramadan.jpg",
    title: "Masjid al-Haram la nuit",
    author: "Ariandra 03",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    page: "https://commons.wikimedia.org/wiki/File:Mecca.JPG",
  },
  process: {
    src: "/photos/process-bg.jpg",
    title: "La vallée de Mina et ses tentes",
    author: "Mubeen Rahman",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    page: "https://commons.wikimedia.org/wiki/File:Mina_Overview.JPG",
  },
  panorama: {
    src: "/photos/panorama.jpg",
    title: "Parasols de la cour de Masjid an-Nabawi",
    author: "King Eliot",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    page: "https://commons.wikimedia.org/wiki/File:Masjid_e_Nabawi_Courtyard_Umbrellas.jpg",
  },
} satisfies Record<string, Credit>;

export const photoCredits: Credit[] = Object.values(photos);

/* ------------------------------------------------------------------ */
/* Agency                                                               */
/* ------------------------------------------------------------------ */

export const agency = {
  name: "Voyages Cortoba",
  tagline: "Hajj, Omra et voyages organisés depuis Montréal",
  legalName: "9200-2807 Québec Inc.",
  permit: "Titulaire d'un permis du Québec no 702852",
  address: {
    street: "657, boul. Curé-Labelle, bureau 250",
    city: "Laval (Québec) H7V 2T8",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=657+Cur%C3%A9-Labelle+Laval+QC+H7V+2T8",
  },
  phone: { label: "514 303-3033", href: "tel:+15143033033" },
  tollFree: { label: "1 877 714-3033", href: "tel:+18777143033" },
  email: { label: "info@voyagescortoba.com", href: "mailto:info@voyagescortoba.com" },
  hours: "Lundi au samedi, 10 h à 18 h",
  website: "https://www.voyagescortoba.com",
  social: [
    { label: "Facebook", href: "https://www.facebook.com/p/Cortoba-Haj-et-Omra-100046608496159/" },
    { label: "Instagram", href: "https://www.instagram.com/voyagescortoba/" },
  ],
};

export const nav = {
  links: [
    { label: "Omra", href: "#departs" },
    { label: "Hajj", href: "#categories" },
    { label: "Contact", href: "#contact" },
  ],
  cta: { label: "Explorer", href: "#departs" },
};

/* ------------------------------------------------------------------ */
/* Sections                                                             */
/* ------------------------------------------------------------------ */

export const hero = {
  word: "Pèlerinage",
  lead: "En toute sérénité. Hajj, Omra et voyages organisés depuis Montréal, en un seul endroit.",
  cta: { label: "Voir les départs", href: "#departs" },
  imageLabel: photos.hero.title,
  image: photos.hero.src,
};

export const statement = {
  muted: "Plus de 20 ans à accompagner les pèlerins du Québec.",
  strong: "Voyez par vous-même",
};

export type Category = {
  title: string;
  count: string;
  imageLabel: string;
  image?: string;
  href: string;
};

export const categories: Category[] = [
  {
    title: "Omra en groupe",
    count: "/ 12+ départs par an",
    imageLabel: photos.omra.title,
    image: photos.omra.src,
    href: "#departs",
  },
  {
    title: "Hajj Québec 2026",
    count: "/ départ de Montréal",
    imageLabel: photos.hajj.title,
    image: photos.hajj.src,
    href: "#contact",
  },
  {
    title: "Voyages organisés",
    count: "/ 6+ destinations",
    imageLabel: photos.voyages.title,
    image: photos.voyages.src,
    href: "#carte",
  },
];

export const about = {
  imageLabel: photos.about.title,
  image: photos.about.src,
  text: "Voyages Cortoba est une agence spécialisée dans le tourisme religieux et éthique. Nous organisons le pèlerinage de bout en bout : vols, hôtels 4 étoiles, visas, visites religieuses et un accompagnement francophone, technique et spirituel, du départ de Montréal jusqu'au retour.",
  stats: [
    { value: "20+", label: "années au service des pèlerins" },
    { value: "4★", label: "hôtels à proximité des lieux saints" },
  ],
  trusted: "Approuvé par des pèlerins qui cherchent plus qu'un simple voyage.",
  /** Wordmarks only; swap for real logo files in `public/` when available. */
  partners: ["Saudia", "Turkish Airlines", "Qatar Airways"],
};

export type Departure = {
  id: string;
  title: string;
  price: number | null;
  priceNote?: string;
  location: string;
  dates: string;
  duration: string;
  group: string;
  rating: { label: string; stars: number };
  imageLabel: string;
  image?: string;
};

export const departures: Departure[] = [
  {
    id: "decembre-directe",
    title: "Omra Décembre, vol direct",
    price: 4980,
    priceNote: "en quadruple · 5 590 $ en double",
    location: "Médine et La Mecque, Arabie saoudite",
    dates: "28 déc. 2026 – 6 janv. 2027 (10 jours, 9 nuits)",
    duration: "10 jours",
    group: "Groupe accompagné",
    rating: { label: "Hôtels 4 étoiles près du Haram", stars: 4 },
    imageLabel: photos.decembre.title,
    image: photos.decembre.src,
  },
  {
    id: "octobre-confort",
    title: "Omra Octobre, formule confort",
    price: null,
    location: "Médine et La Mecque, Arabie saoudite",
    dates: "Octobre 2026 (10 à 12 jours)",
    duration: "10 à 12 jours",
    group: "Petit groupe accompagné",
    rating: { label: "Hôtels 4 étoiles à quelques pas du Haram", stars: 4 },
    imageLabel: photos.octobre.title,
    image: photos.octobre.src,
  },
  {
    id: "istanbul-combinee",
    title: "Omra + Istanbul, séjour combiné",
    price: null,
    location: "Istanbul, Médine et La Mecque",
    dates: "Départs réguliers (12 à 14 jours)",
    duration: "12 à 14 jours",
    group: "Groupe accompagné",
    rating: { label: "Hôtels 4 étoiles, foi et culture", stars: 4 },
    imageLabel: photos.istanbul.title,
    image: photos.istanbul.src,
  },
  {
    id: "ramadan-2027",
    title: "Omra du Ramadan, derniers dix jours",
    price: null,
    location: "Médine et La Mecque, Arabie saoudite",
    dates: "Février – mars 2027 (formules éco et confort)",
    duration: "10 à 15 jours",
    group: "Groupe accompagné",
    rating: { label: "Hôtels 4 étoiles, guide et imam", stars: 4 },
    imageLabel: photos.ramadan.title,
    image: photos.ramadan.src,
  },
];

export const departuresCta = { label: "Explorer le départ", href: "#contact" };

export const process = {
  imageLabel: photos.process.title,
  image: photos.process.src,
  text: "Un seul interlocuteur du choix du départ jusqu'au retour. Confirmation rapide et conseiller dédié pour les demandes sur mesure.",
  steps: [
    { number: "01", title: "Choisir un départ" },
    { number: "02", title: "Inscription et dépôt" },
    { number: "03", title: "Visa et préparation" },
    { number: "04", title: "Départ accompagné" },
  ],
};

export type MapPoint = {
  name: string;
  lat: number;
  lng: number;
  hub?: boolean;
  /** Put the label under the point when a neighbour sits just above it. */
  labelBelow?: boolean;
};

export const mapPoints: MapPoint[] = [
  { name: "Montréal", lat: 45.5, lng: -73.6, hub: true },
  { name: "Casablanca", lat: 33.6, lng: -7.6 },
  { name: "Tunis", lat: 36.8, lng: 10.2 },
  { name: "Istanbul", lat: 41.0, lng: 29.0 },
  { name: "Médine", lat: 24.5, lng: 39.6 },
  { name: "La Mecque", lat: 21.4, lng: 39.8, labelBelow: true },
  { name: "Dubaï", lat: 25.2, lng: 55.3 },
  { name: "Kuala Lumpur", lat: 3.1, lng: 101.7 },
];

export const team = {
  kicker: "Guides et accompagnateurs",
  title: "Les visages derrière Voyages Cortoba",
  /**
   * Roles only: names and portraits must be supplied by the agency before
   * publishing. `name` is a visible placeholder until then.
   */
  members: [
    { name: "Nom à compléter", role: "Chef de groupe", imageLabel: "Portrait" },
    { name: "Nom à compléter", role: "Imam accompagnateur", imageLabel: "Portrait" },
    { name: "Nom à compléter", role: "Conseillère billetterie", imageLabel: "Portrait" },
    { name: "Nom à compléter", role: "Guide à Médine", imageLabel: "Portrait" },
  ],
};

export const panorama = {
  imageLabel: photos.panorama.title,
  image: photos.panorama.src,
};

export const footer = {
  links: [
    { label: "Omra", href: "#departs" },
    { label: "Hajj", href: "#categories" },
    { label: "Contact", href: "#contact" },
  ],
};
