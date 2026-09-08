/**
 * Copy and data for the Voyages Cortoba landing page.
 *
 * Everything a non-developer might want to change lives here: navigation,
 * hero copy, departures, prices, FAQ, contact details. Facts (address,
 * permit number, phone numbers, the December 2026 Omra pricing) were taken
 * from the agency's public listings; prices marked "À venir" were not
 * published at the time of writing and should be confirmed with the agency.
 */

export const agency = {
  name: "Voyages Cortoba",
  shortName: "Cortoba",
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

export const nav = [
  { label: "Hajj", href: "#hajj" },
  { label: "Omra", href: "#departs" },
  { label: "Tourisme", href: "#destinations" },
  { label: "Billetterie", href: "#services" },
  { label: "À propos", href: "#a-propos" },
  { label: "FAQ", href: "#faq" },
];

export const hero = {
  eyebrow: "Agence de pèlerinage · Laval, Québec",
  title: "Votre pèlerinage, organisé avec rigueur et sérénité.",
  lead:
    "Depuis 20 ans, Voyages Cortoba accompagne les pèlerins du Québec vers La Mecque et Médine : vols, hôtels 4 étoiles, visas, guides et imams francophones. Vous n'avez qu'à vous préparer spirituellement.",
  primaryCta: { label: "Voir les départs Omra", href: "#departs" },
  secondaryCta: { label: "Hajj Québec 2026", href: "#hajj" },
  image: {
    label: "Photo : Masjid al-Haram au crépuscule",
    /** Drop a file in `public/` and point this at it to replace the slot. */
    src: undefined as string | undefined,
  },
  floatingCard: {
    eyebrow: "Prochain départ",
    title: "Omra Décembre · directe",
    meta: "28 déc. 2026 → 6 janv. 2027",
  },
};

export const search = {
  types: ["Omra", "Hajj", "Omra + Istanbul", "Voyage organisé", "Billet d'avion"],
  periods: [
    "Octobre 2026",
    "Novembre 2026",
    "Décembre 2026",
    "Janvier – Février 2027",
    "Ramadan 2027",
    "Hajj 2026",
  ],
  travellers: ["1 voyageur", "2 voyageurs", "3 voyageurs", "4 voyageurs et +"],
  cta: "Trouver un départ",
};

export const trustPoints = [
  "20 ans d'expérience",
  "Permis du Québec no 702852",
  "Départs de Montréal",
  "Accompagnement francophone",
  "Hôtels 4 étoiles",
  "Visas inclus",
];

export const stats = [
  { value: "20", suffix: "ans", label: "au service des pèlerins du Québec" },
  { value: "100", suffix: "%", label: "des groupes accompagnés par un guide et un imam" },
  { value: "4", suffix: "★", label: "hôtels à proximité des lieux saints" },
  { value: "6", suffix: "j/7", label: "une équipe joignable, du lundi au samedi" },
];

export type Service = {
  id: string;
  kicker: string;
  title: string;
  description: string;
  bullets: string[];
  cta: { label: string; href: string };
  imageLabel: string;
  image?: string;
};

export const services: Service[] = [
  {
    id: "hajj-omra",
    kicker: "Notre cœur de métier",
    title: "Hajj et Omra",
    description:
      "Omra en groupe, Omra du Ramadan, Omra à la carte et Hajj : une organisation complète, du billet d'avion aux visites religieuses, avec un encadrement spirituel francophone.",
    bullets: ["Groupes accompagnés", "Hôtels 4★ près du Haram", "Visas inclus"],
    cta: { label: "Voir les départs", href: "#departs" },
    imageLabel: "Photo : pèlerins devant la Kaaba",
  },
  {
    id: "tourisme",
    kicker: "Tourisme éthique",
    title: "Voyages organisés",
    description:
      "Des séjours qui allient confort, découverte et tranquillité au Maroc, en Tunisie, en Turquie et en Malaisie : hébergements de qualité, programmes équilibrés et encadrement professionnel.",
    bullets: ["Programmes équilibrés", "Hébergements de qualité", "Guides francophones"],
    cta: { label: "Découvrir les destinations", href: "#destinations" },
    imageLabel: "Photo : Istanbul, mosquée Bleue",
  },
  {
    id: "billetterie",
    kicker: "Billetterie",
    title: "Billets et réservations",
    description:
      "Billets d'avion vers toutes les destinations, traversées maritimes, billets de train, location de voiture et réservations d'hôtel. Un service rapide, personnalisé et flexible.",
    bullets: ["Toutes destinations", "Options flexibles", "Service personnalisé"],
    cta: { label: "Demander un tarif", href: "#contact" },
    imageLabel: "Photo : aile d'avion au-dessus des nuages",
  },
];

export type Departure = {
  id: string;
  tag: string;
  title: string;
  dates: string;
  duration: string;
  from: string;
  /** Published price, or `null` while the agency has not announced it. */
  price: number | null;
  priceNote?: string;
  highlights: string[];
  imageLabel: string;
  image?: string;
  featured?: boolean;
};

export const departures: Departure[] = [
  {
    id: "decembre-directe",
    tag: "Directe",
    title: "Omra Décembre",
    dates: "28 déc. 2026 → 6 janv. 2027",
    duration: "10 jours",
    from: "Montréal (YUL)",
    price: 4980,
    priceNote: "en chambre quadruple · 5 590 $ en double",
    highlights: ["Vol direct", "Médine + La Mecque", "Guide et imam"],
    imageLabel: "Photo : Masjid an-Nabawi, Médine",
    featured: true,
  },
  {
    id: "octobre-economique",
    tag: "Économique",
    title: "Omra Octobre",
    dates: "Octobre 2026",
    duration: "10 à 12 jours",
    from: "Montréal (YUL)",
    price: null,
    highlights: ["Meilleur rapport qualité-prix", "Hôtels 4★", "Guide francophone"],
    imageLabel: "Photo : cour du Haram",
  },
  {
    id: "octobre-confort",
    tag: "Confort",
    title: "Omra Octobre",
    dates: "Octobre 2026",
    duration: "10 à 12 jours",
    from: "Montréal (YUL)",
    price: null,
    highlights: ["Hôtels à quelques pas du Haram", "Petits groupes", "Guide et imam"],
    imageLabel: "Photo : tour de l'horloge, La Mecque",
  },
  {
    id: "novembre-directe",
    tag: "Directe",
    title: "Omra Novembre",
    dates: "Novembre 2026",
    duration: "10 jours",
    from: "Montréal (YUL)",
    price: null,
    highlights: ["Vol direct", "Médine + La Mecque", "Visites religieuses"],
    imageLabel: "Photo : pèlerins en ihram",
  },
  {
    id: "istanbul-combinee",
    tag: "Combinée",
    title: "Omra + Istanbul",
    dates: "Départs réguliers",
    duration: "12 à 14 jours",
    from: "Montréal (YUL)",
    price: null,
    highlights: ["Foi, culture et découverte", "Hôtels 4★", "Accompagnement francophone"],
    imageLabel: "Photo : Bosphore, Istanbul",
  },
  {
    id: "ramadan-2027",
    tag: "Ramadan",
    title: "Omra du Ramadan",
    dates: "Février – mars 2027",
    duration: "Options éco et confort",
    from: "Montréal (YUL)",
    price: null,
    highlights: ["Derniers dix jours", "Formules éco ou confort", "Guide et imam"],
    imageLabel: "Photo : Haram illuminé la nuit",
  },
];

export const hajj = {
  kicker: "Hajj Québec 2026",
  title: "Le Hajj, encadré du départ de Montréal jusqu'au retour.",
  lead:
    "Nous ne vous servons pas seulement ici au Canada : nous voyageons avec vous. Chefs de groupe et savants vous guident en Arabie saoudite, et ce service ne vous coûte rien de plus. Inscrivez-vous à l'un de nos forfaits et profitez de l'ensemble de nos services.",
  inclusions: [
    { title: "Accompagnement spirituel", text: "Imams et guides bilingues, rappels et préparation aux rites." },
    { title: "Logistique complète", text: "Vols, transferts, tentes à Mina et Arafat, repas." },
    { title: "Hébergement de qualité", text: "Hôtels 4 étoiles à Médine et à La Mecque." },
    { title: "Visas inclus", text: "Nous nous occupons des démarches du visa Hajj." },
    { title: "Visites religieuses", text: "Mosquée de Quba, martyrs d'Ohoud, Qiblatayn et plus." },
    { title: "Séances de préparation", text: "Rencontres d'information à Laval avant le départ." },
  ],
  cta: { label: "Demander le forfait Hajj 2026", href: "#contact" },
  secondary: { label: "Modalités d'inscription", href: `${agency.website}/modalites-dinscription-omra-et-hajj/` },
  imageLabel: "Photo : mont Arafat",
  image: undefined as string | undefined,
};

export type Destination = {
  name: string;
  country: string;
  note: string;
  imageLabel: string;
  image?: string;
  span?: "wide" | "tall";
};

export const destinations: Destination[] = [
  { name: "La Mecque et Médine", country: "Arabie saoudite", note: "Omra et Hajj", imageLabel: "Photo : Kaaba", span: "wide" },
  { name: "Istanbul", country: "Turquie", note: "Combinée Omra", imageLabel: "Photo : Sainte-Sophie" },
  { name: "Marrakech et Fès", country: "Maroc", note: "Voyage organisé", imageLabel: "Photo : médina de Fès", span: "tall" },
  { name: "Tunis et Kairouan", country: "Tunisie", note: "Voyage organisé", imageLabel: "Photo : Sidi Bou Saïd" },
  { name: "Kuala Lumpur", country: "Malaisie", note: "Voyage organisé", imageLabel: "Photo : tours Petronas" },
  { name: "Dubaï", country: "Émirats arabes unis", note: "Combinée Omra", imageLabel: "Photo : Dubaï de nuit" },
];

export const steps = [
  {
    number: "01",
    title: "Choisissez votre départ",
    text: "Omra directe, combinée ou Hajj : comparez les dates, les formules et les hôtels avec un conseiller.",
  },
  {
    number: "02",
    title: "Inscrivez-vous",
    text: "Passeport valide, dépôt et formulaire d'inscription. Nous nous chargeons du visa et des réservations.",
  },
  {
    number: "03",
    title: "Préparez-vous",
    text: "Séances d'information à Laval, guide des rites et liste de bagages : vous partez prêt.",
  },
  {
    number: "04",
    title: "Partez accompagné",
    text: "De l'aéroport de Montréal jusqu'au retour, un chef de groupe et un imam francophones vous accompagnent.",
  },
];

export const about = {
  kicker: "À propos",
  title: "Une agence dédiée au pèlerinage, ancrée au Québec.",
  paragraphs: [
    "Voyages Cortoba est une agence de voyages spécialisée dans le tourisme religieux et éthique. Notre activité principale est l'organisation du pèlerinage à La Mecque : Hajj, Omra en groupe, Omra du Ramadan et Omra à la carte.",
    "Depuis plusieurs années, nous accompagnons des centaines de voyageurs avec passion, rigueur et éthique. Nous nous distinguons par un accompagnement complet, technique, francophone et religieux, des hébergements confortables et un service personnalisé, pour des voyages spirituels en toute sérénité.",
  ],
  facts: [
    { label: "Fondée à", value: "Laval, Québec" },
    { label: "Permis", value: "OPC no 702852" },
    { label: "Langues", value: "Français, arabe, anglais" },
    { label: "Spécialité", value: "Hajj et Omra" },
  ],
  imageLabel: "Photo : équipe Cortoba avec un groupe à Médine",
  image: undefined as string | undefined,
};

/**
 * Placeholder testimonials. These are NOT real reviews: replace each entry
 * with a genuine, authorised quote from a client before publishing.
 */
export const testimonials = [
  {
    quote:
      "Espace réservé : insérez ici le témoignage authentique d'un pèlerin ayant voyagé avec Cortoba.",
    name: "Prénom N.",
    detail: "Omra, Laval",
  },
  {
    quote:
      "Espace réservé : insérez ici le témoignage authentique d'une famille ayant accompli le Hajj avec Cortoba.",
    name: "Prénom N.",
    detail: "Hajj, Montréal",
  },
  {
    quote:
      "Espace réservé : insérez ici le témoignage authentique d'un voyageur ayant participé à un séjour combiné.",
    name: "Prénom N.",
    detail: "Omra + Istanbul, Longueuil",
  },
];

export const partners = ["Saudia", "Turkish Airlines", "Qatar Airways", "Emirates", "Air Canada"];

export const faq = [
  {
    q: "Qu'est-ce qui est inclus dans un forfait Omra?",
    a: "Le billet d'avion aller-retour depuis Montréal, le visa, l'hébergement en hôtel 4 étoiles à Médine et à La Mecque, les transferts, les visites religieuses et l'accompagnement d'un guide et d'un imam francophones. Les détails varient selon la formule : consultez la fiche de chaque départ.",
  },
  {
    q: "Quels documents dois-je fournir pour m'inscrire?",
    a: "Un passeport valide au moins six mois après la date de retour, des photos d'identité et le formulaire d'inscription signé, accompagné du dépôt. Les modalités complètes sont sur la page Modalités d'inscription du site.",
  },
  {
    q: "Puis-je payer en plusieurs versements?",
    a: "Oui. Un dépôt confirme votre place, et le solde est réglé selon un calendrier convenu avant le départ. Contactez-nous pour connaître les échéances du départ qui vous intéresse.",
  },
  {
    q: "Les groupes sont-ils accompagnés en français?",
    a: "Toujours. Chaque groupe part avec un chef de groupe et un imam francophones, du départ de Montréal jusqu'au retour.",
  },
  {
    q: "Proposez-vous des Omra à la carte?",
    a: "Oui. Nous organisons des Omra individuelles ou familiales aux dates de votre choix, avec vols, hôtels et visa, sans encadrement de groupe.",
  },
  {
    q: "Êtes-vous une agence agréée?",
    a: "Voyages Cortoba (9200-2807 Québec Inc.) est titulaire du permis d'agent de voyages du Québec no 702852, délivré par l'Office de la protection du consommateur. Vos achats sont couverts par le Fonds d'indemnisation des clients des agents de voyages.",
  },
];

export const contact = {
  kicker: "Contact",
  title: "Parlons de votre prochain départ.",
  lead: "Appelez-nous, écrivez-nous ou passez au bureau de Laval. Un conseiller vous répond du lundi au samedi.",
  form: {
    tripTypes: ["Omra", "Hajj 2026", "Omra + Istanbul", "Voyage organisé", "Billet d'avion", "Autre"],
    submit: "Envoyer ma demande",
    note: "En envoyant ce formulaire, votre logiciel de courriel s'ouvrira avec votre demande pré-remplie.",
  },
  mapLabel: "Carte : 657, boul. Curé-Labelle, Laval",
};

export const footerColumns = [
  {
    heading: "Pèlerinage",
    links: [
      { label: "Hajj Québec 2026", href: "#hajj" },
      { label: "Omra en groupe", href: "#departs" },
      { label: "Omra du Ramadan", href: "#departs" },
      { label: "Omra à la carte", href: "#contact" },
    ],
  },
  {
    heading: "Voyages",
    links: [
      { label: "Voyages organisés", href: "#destinations" },
      { label: "Billetterie", href: "#services" },
      { label: "Location de voiture", href: "#services" },
      { label: "Réservations d'hôtel", href: "#services" },
    ],
  },
  {
    heading: "Agence",
    links: [
      { label: "À propos", href: "#a-propos" },
      { label: "Questions fréquentes", href: "#faq" },
      { label: "Modalités d'inscription", href: `${agency.website}/modalites-dinscription-omra-et-hajj/` },
      { label: "Conditions de vente", href: `${agency.website}/conditions-de-vente/` },
    ],
  },
];
