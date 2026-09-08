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
  /** Exact Wikimedia Commons file name. */
  file: string;
  /** What the photo shows, for alt text and the credits list. */
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
};

/**
 * Freely licensed photographs from Wikimedia Commons, loaded directly by the
 * visitor's browser. Each entry's licence requires attribution, which the
 * footer renders from this list. Replace any entry with a file in `public/`
 * (set `src` on the matching content field) when the agency supplies its own
 * photography.
 */
export const photos = {
  haramPanorama: {
    file: "Masjid al-Haram panorama.JPG",
    title: "Masjid al-Haram, La Mecque",
    author: "Bluemangoa2z",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
  },
  supplicatingPilgrim: {
    file: "Supplicating Pilgrim at Masjid Al Haram. Mecca, Saudi Arabia.jpg",
    title: "Pèlerin en prière au Masjid al-Haram",
    author: "Ali Mansuri",
    license: "CC BY-SA 2.5",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.5/",
  },
  arafat: {
    file: "Pilgrims cover Arafat's roads, plains and mountain - Flickr - Al Jazeera English.jpg",
    title: "Pèlerins au mont Arafat",
    author: "Omar Chatriwala / Al Jazeera English",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
  },
  fes: {
    file: "Medina of Fes, Marocco.jpg",
    title: "Médina de Fès",
    author: "Petar Milošević",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  nabawi: {
    file: "Al Masjid An-Nabawi.jpg",
    title: "Masjid an-Nabawi, Médine",
    author: "Ali Lajami",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  nabawiSunrise: {
    file: "Sunrise at al-Masjid al-Nabawi.jpg",
    title: "Lever du soleil sur Masjid an-Nabawi",
    author: "ZxxZxxZ",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  clockTower: {
    file: "Makkah Royal Clock Tower in 2012.jpg",
    title: "Tour de l'horloge, La Mecque",
    author: "King Eliot",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  hagiaSophia: {
    file: "Hagia Sophia Mars 2013.jpg",
    title: "Sainte-Sophie, Istanbul",
    author: "Arild Vågen",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  haram2009: {
    file: "Masjid al-Haram.JPG",
    title: "Masjid al-Haram et la Kaaba",
    author: "Zainichi Gaikokujin",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
  },
  nabawiNight: {
    file: "Madinah, Al haram at night (2512058060).jpg",
    title: "Masjid an-Nabawi la nuit",
    author: "marviikad",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
  },
  nabawiEvening: {
    file: "Madina Haram at evening.jpg",
    title: "Masjid an-Nabawi en soirée",
    author: "Ahmed Medineli",
    license: "Domaine public",
    licenseUrl: "https://commons.wikimedia.org/wiki/File:Madina_Haram_at_evening.jpg",
  },
} satisfies Record<string, Credit>;

/** Direct image URL for a Commons file, resized server-side by Wikimedia. */
export function commonsUrl(credit: Credit, width = 1800) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(credit.file)}?width=${width}`;
}

export function commonsPage(credit: Credit) {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(credit.file.replace(/ /g, "_"))}`;
}

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
  imageLabel: photos.haramPanorama.title,
  image: commonsUrl(photos.haramPanorama, 2400) as string | undefined,
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
    imageLabel: photos.supplicatingPilgrim.title,
    image: commonsUrl(photos.supplicatingPilgrim, 1200),
    href: "#departs",
  },
  {
    title: "Hajj Québec 2026",
    count: "/ départ de Montréal",
    imageLabel: photos.arafat.title,
    image: commonsUrl(photos.arafat, 1200),
    href: "#contact",
  },
  {
    title: "Voyages organisés",
    count: "/ 6+ destinations",
    imageLabel: photos.fes.title,
    image: commonsUrl(photos.fes, 1200),
    href: "#carte",
  },
];

export const about = {
  imageLabel: photos.nabawi.title,
  image: commonsUrl(photos.nabawi, 1600) as string | undefined,
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
    imageLabel: photos.nabawiSunrise.title,
    image: commonsUrl(photos.nabawiSunrise, 900),
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
    imageLabel: photos.clockTower.title,
    image: commonsUrl(photos.clockTower, 900),
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
    imageLabel: photos.hagiaSophia.title,
    image: commonsUrl(photos.hagiaSophia, 900),
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
    imageLabel: photos.haram2009.title,
    image: commonsUrl(photos.haram2009, 900),
  },
];

export const departuresCta = { label: "Explorer le départ", href: "#contact" };

export const process = {
  imageLabel: photos.nabawiNight.title,
  image: commonsUrl(photos.nabawiNight, 2000) as string | undefined,
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
  imageLabel: photos.nabawiEvening.title,
  image: commonsUrl(photos.nabawiEvening, 2400) as string | undefined,
};

export const footer = {
  links: [
    { label: "Omra", href: "#departs" },
    { label: "Hajj", href: "#categories" },
    { label: "Contact", href: "#contact" },
  ],
};
