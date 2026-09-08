/**
 * Copy and data for the Voyages Cortoba landing page.
 *
 * The page follows the Vita Travels design language section for section,
 * with the agency's own content. Facts (address, permit number, phone
 * numbers, the December 2026 Omra pricing) come from the agency's public
 * listings; prices marked `null` were not published at the time of writing
 * and render as "Tarif à venir" until confirmed.
 */

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

export const hero = {
  word: "Pèlerinage",
  lead: "En toute sérénité. Hajj, Omra et voyages organisés depuis Montréal, en un seul endroit.",
  cta: { label: "Voir les départs", href: "#departs" },
  imageLabel: "Photo : Masjid al-Haram, heure dorée",
  /** Drop a file in `public/` and point this at it to replace the slot. */
  image: undefined as string | undefined,
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
  { title: "Omra en groupe", count: "/ 12+ départs par an", imageLabel: "Photo : tawaf autour de la Kaaba", href: "#departs" },
  { title: "Hajj Québec 2026", count: "/ départ de Montréal", imageLabel: "Photo : mont Arafat", href: "#contact" },
  { title: "Voyages organisés", count: "/ 6+ destinations", imageLabel: "Photo : médina de Fès", href: "#carte" },
];

export const about = {
  imageLabel: "Photo : Masjid an-Nabawi au crépuscule",
  image: undefined as string | undefined,
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
    imageLabel: "Photo : Masjid an-Nabawi",
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
    imageLabel: "Photo : tour de l'horloge, La Mecque",
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
    imageLabel: "Photo : Bosphore, Istanbul",
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
    imageLabel: "Photo : Haram illuminé la nuit",
  },
];

export const departuresCta = { label: "Explorer le départ", href: "#contact" };

export const process = {
  imageLabel: "Photo : brume sur les collines de Médine",
  image: undefined as string | undefined,
  text: "Un seul interlocuteur du choix du départ jusqu'au retour. Confirmation rapide et conseiller dédié pour les demandes sur mesure.",
  steps: [
    { number: "01", title: "Choisir un départ" },
    { number: "02", title: "Inscription et dépôt" },
    { number: "03", title: "Visa et préparation" },
    { number: "04", title: "Départ accompagné" },
  ],
};

export type MapPoint = { name: string; lat: number; lng: number; hub?: boolean };

export const mapPoints: MapPoint[] = [
  { name: "Montréal", lat: 45.5, lng: -73.6, hub: true },
  { name: "Casablanca", lat: 33.6, lng: -7.6 },
  { name: "Tunis", lat: 36.8, lng: 10.2 },
  { name: "Istanbul", lat: 41.0, lng: 29.0 },
  { name: "Médine", lat: 24.5, lng: 39.6 },
  { name: "La Mecque", lat: 21.4, lng: 39.8 },
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
  imageLabel: "Photo : panorama de Médine au lever du jour",
  image: undefined as string | undefined,
};

export const footer = {
  links: [
    { label: "Omra", href: "#departs" },
    { label: "Hajj", href: "#categories" },
    { label: "Contact", href: "#contact" },
  ],
};
