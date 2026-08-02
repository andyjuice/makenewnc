/**
 * Content loader — reads YAML config and Markdown content at build time.
 * Used by the Instagram Gateway layout and pages.
 */
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import matter from 'gray-matter';

const root = path.join(process.cwd(), 'src');
const contentRoot = path.join(process.cwd(), 'content');

export type SiteConfig = {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  social: {
    instagram: string;
    facebook: string;
    youtube: string;
  };
  instagramPitch: string;
  instagramUpdatesNote: string;
};

export type ServiceBlock = {
  name: string;
  subtitle?: string;
  time: string;
  topic: string;
  description: string;
  logistics: string;
};

export type CampusAddress = {
  street: string;
  city: string;
  state: string;
  zip: string;
  note: string;
  mapsUrl: string;
};

export type CampusContact = {
  phone: string;
  email: string;
};

export type CampusStatus = 'active' | 'coming-soon';

export type Campus = {
  slug: string;
  name: string;
  university: string;
  city: string;
  status: CampusStatus;
  /** Campus contact — phone and email for reaching this location. */
  contact?: CampusContact;
  /** Campus Instagram profile — primary CTA from the locations picker. */
  instagram: string;
  description: string;
  address: CampusAddress | null;
  services: { friday: ServiceBlock; sunday: ServiceBlock } | null;
};

export type CampusesConfig = {
  primarySlug: string;
  locationsLead: string;
  campuses: Campus[];
};

export type Announcements = {
  topBar: {
    enabled: boolean;
    message: string;
    link?: string;
    linkText?: string;
    triggerPopup?: boolean;
    expires?: string;
  };
  popup: {
    enabled: boolean;
    message: string;
    link?: string;
    linkText?: string;
    dismissible: boolean;
    expires?: string;
  };
};

export type Characteristic = {
  id: string;
  phrase: string;
  holdMs: number;
  aboutAnchor: string;
  /** Optional footnote for the cycling phrase (e.g. Duke-only address context). */
  footnote?: string;
};

export type DifferentiatorItem = {
  letter: string;
  word: string;
  summary: string;
  /**
   * Extended card description. May contain trusted inline HTML (e.g. an
   * `<abbr title="...">` definition tooltip, or a same-site `<a>` link) —
   * content/home.md is the only writer, so what-were-about.astro renders
   * this via `set:html` rather than escaping it as plain text.
   */
  body: string;
};

export type Differentiator = {
  title: string;
  acronym: string;
  /**
   * Optional promo/flyer image rendered at the top of the FART section
   * (immediately under the "Come FART with us" heading, before the intro
   * copy) — a public/images/ path, e.g. `/images/FART.jpg`. Purely
   * decorative reinforcement of the section's existing text; the section
   * renders exactly as before if this is omitted.
   */
  image?: string;
  /** Required alongside `image` — describes the flyer for screen readers. */
  imageAlt?: string;
  intro: string;
  items: DifferentiatorItem[];
};

export type HomeContent = {
  title: string;
  brand: string;
  tagline: string;
  heroImage: string;
  showHeroVideo: boolean;
  aboutTitle: string;
  aboutIntro: string;
  differentiator: Differentiator;
  characteristics: Characteristic[];
  cta: { heading: string; text: string; link: string };
};

export type StoryContent = {
  title: string;
  teaser: string;
  sections: { era: string; body: string }[];
  gallery: string[];
};

export type BeliefsContent = {
  title: string;
  summary: string;
  body: string;
  bullets: string[];
};

export type CtptChapter = {
  title: string;
  subtitle: string;
  url: string;
};

export type CtptContent = {
  title: string;
  shortTitle: string;
  intro: string;
  description: string;
  chapters: CtptChapter[];
};

/** One slide in the home card-hand carousel (from src/data/carousel.yaml). */
export type CarouselCard = {
  imageUrl: string;
  alt: string;
  link?: string;
};

type CarouselCardInput = {
  image: string;
  alt: string;
  link?: string;
};

export type CarouselConfig = {
  cards: CarouselCardInput[];
};

export type CampusCarouselsConfig = Record<string, CarouselConfig>;

const CAROUSEL_IMAGE_DIR = '/images/carousel';
const CAMPUS_CAROUSEL_IMAGE_DIR = '/images/locations';

/** Map manifest image field to a public URL at build time. */
function resolveCarouselImage(image: string, baseDir: string): string {
  if (image.startsWith('/') || image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  return `${baseDir}/${image}`;
}

function readYaml<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(raw) as T;
}

function readMd<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(raw);
  return data as T;
}

function isExpired(expires?: string): boolean {
  if (!expires) return false;
  return new Date(expires) < new Date(new Date().toDateString());
}

export function getCampusesConfig(): CampusesConfig {
  return readYaml<CampusesConfig>(path.join(root, 'data', 'campuses.yaml'));
}

export function getCampuses(): Campus[] {
  return getCampusesConfig().campuses;
}

export function getCampus(slug: string): Campus | undefined {
  return getCampuses().find((c) => c.slug === slug);
}

/** Site-wide brand, social, and contact config from site.yaml. */
export function getSite(): SiteConfig {
  return readYaml<SiteConfig>(path.join(root, 'data', 'site.yaml'));
}

export function getAnnouncements(): Announcements {
  const data = readYaml<Announcements>(path.join(root, 'data', 'announcements.yaml'));
  if (data.topBar.enabled && isExpired(data.topBar.expires)) {
    data.topBar.enabled = false;
  }
  if (data.popup.enabled && isExpired(data.popup.expires)) {
    data.popup.enabled = false;
  }
  return data;
}

export function getHome(): HomeContent {
  return readMd<HomeContent>(path.join(contentRoot, 'home.md'));
}

export function getStory(): StoryContent {
  return readMd<StoryContent>(path.join(contentRoot, 'story.md'));
}

export function getBeliefs(): BeliefsContent {
  return readMd<BeliefsContent>(path.join(contentRoot, 'beliefs.md'));
}

export function getCtpt(): CtptContent {
  return readMd<CtptContent>(path.join(contentRoot, 'ctpt.md'));
}

export function getPrivacyTitle(): string {
  return readMd<{ title: string }>(path.join(contentRoot, 'privacy.md')).title;
}

export function getPrivacyBody(): string {
  const raw = fs.readFileSync(path.join(contentRoot, 'privacy.md'), 'utf-8');
  return matter(raw).content.trim();
}

/** Curated home carousel cards — images in public/images/carousel/, manifest in carousel.yaml. */
export function getCarouselCards(): CarouselCard[] {
  const data = readYaml<CarouselConfig>(path.join(root, 'data', 'carousel.yaml'));
  return data.cards.map((card) => ({
    imageUrl: resolveCarouselImage(card.image, CAROUSEL_IMAGE_DIR),
    alt: card.alt,
    link: card.link?.trim() || undefined,
  }));
}

/** Per-campus gallery carousel — images in public/images/locations/{slug}/, manifest in campus-carousels.yaml. */
export function getCampusCarouselCards(slug: string): CarouselCard[] {
  const data = readYaml<CampusCarouselsConfig>(path.join(root, 'data', 'campus-carousels.yaml'));
  const campus = data[slug];
  if (!campus?.cards?.length) return [];
  const baseDir = `${CAMPUS_CAROUSEL_IMAGE_DIR}/${slug}`;
  return campus.cards.map((card) => ({
    imageUrl: resolveCarouselImage(card.image, baseDir),
    alt: card.alt,
    link: card.link?.trim() || undefined,
  }));
}

/** Normalize internal site paths (root-relative). */
export function siteLink(href: string): string {
  if (!href || href.startsWith('http') || href.startsWith('#')) return href;
  return href.startsWith('/') ? href : `/${href}`;
}
