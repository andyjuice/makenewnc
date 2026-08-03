/**
 * SEO helpers — canonical URLs, Open Graph defaults, and JSON-LD builders.
 *
 * Fits in the static build pipeline: every page calls these at build time via
 * SeoHead.astro / Site.astro. Canonical host is always www.makenewnc.org
 * (see specs/seo.md and decisions/2026-08-03-seo-foundation.md).
 *
 * Dependents: src/components/SeoHead.astro, src/layouts/Site.astro,
 * src/pages/locations/[slug].astro.
 */
import type { Campus, SiteConfig } from './content';

/** Canonical production origin — must match Cloudflare www redirect + astro.config site. */
export const CANONICAL_ORIGIN = 'https://www.makenewnc.org';

/**
 * Default social preview image. Prefer public/images/og-default.jpg (1200×630)
 * when available; makenew-icon.png is the fallback so shares always have art.
 */
export const DEFAULT_OG_IMAGE_PATH = '/images/og-default.jpg';
export const FALLBACK_OG_IMAGE_PATH = '/images/makenew-icon.png';

/**
 * Build an absolute canonical URL from a pathname.
 * Uses trailing slashes on subpages to match Astro directory build output
 * and @astrojs/sitemap URL shape.
 */
export function canonicalUrl(pathname: string): string {
  let normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (normalized.length > 1 && !normalized.endsWith('/')) {
    normalized += '/';
  }
  return `${CANONICAL_ORIGIN}${normalized}`;
}

/** Turn a site-relative asset path into an absolute URL for og:image. */
export function absoluteAssetUrl(assetPath: string): string {
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
    return assetPath;
  }
  const path = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  return `${CANONICAL_ORIGIN}${path}`;
}

/** Site-wide Organization + Church JSON-LD — emitted on every page. */
export function buildOrganizationJsonLd(site: SiteConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'Church'],
    '@id': `${CANONICAL_ORIGIN}/#organization`,
    name: site.name,
    url: CANONICAL_ORIGIN,
    description: site.tagline,
    email: site.email,
    telephone: site.phone,
    logo: absoluteAssetUrl('/images/makenew-icon.png'),
    sameAs: [site.social.instagram, site.social.facebook, site.social.youtube],
  };
}

type OpeningHoursSpec = {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string;
  opens: string;
  closes: string;
};

/** Map Duke service blocks to schema.org opening hours (24h HH:MM). */
function dukeOpeningHours(): OpeningHoursSpec[] {
  return [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '18:30', closes: '20:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '11:00', closes: '12:00' },
  ];
}

/**
 * Campus-specific Place JSON-LD for local search (address + hours when known).
 * NC State / UNC omit Place until street addresses are published.
 */
export function buildCampusPlaceJsonLd(campus: Campus, site: SiteConfig) {
  if (!campus.address) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Place',
      '@id': `${CANONICAL_ORIGIN}/locations/${campus.slug}#place`,
      name: `[make]new — ${campus.name}`,
      description: campus.description.trim(),
      url: `${CANONICAL_ORIGIN}/locations/${campus.slug}`,
      parentOrganization: { '@id': `${CANONICAL_ORIGIN}/#organization` },
    };
  }

  const { street, city, state, zip } = campus.address;
  return {
    '@context': 'https://schema.org',
    '@type': ['Place', 'Church'],
    '@id': `${CANONICAL_ORIGIN}/locations/${campus.slug}#place`,
    name: `[make]new — ${campus.name}`,
    description: campus.description.trim(),
    url: `${CANONICAL_ORIGIN}/locations/${campus.slug}`,
    telephone: campus.contact?.phone ?? site.phone,
    email: campus.contact?.email ?? site.email,
    parentOrganization: { '@id': `${CANONICAL_ORIGIN}/#organization` },
    address: {
      '@type': 'PostalAddress',
      streetAddress: street,
      addressLocality: city,
      addressRegion: state,
      postalCode: zip,
      addressCountry: 'US',
    },
    openingHoursSpecification: dukeOpeningHours(),
  };
}

/** Recurring gathering events for campuses with published service times. */
export function buildCampusEventJsonLd(campus: Campus, site: SiteConfig) {
  if (!campus.address || !campus.services) return [];

  const location = {
    '@type': 'Place',
    name: `[make]new — ${campus.name}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: campus.address.street,
      addressLocality: campus.address.city,
      addressRegion: campus.address.state,
      postalCode: campus.address.zip,
      addressCountry: 'US',
    },
  };

  const organizer = {
    '@type': 'Organization',
    name: site.name,
    url: CANONICAL_ORIGIN,
  };

  const base = {
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location,
    organizer,
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${CANONICAL_ORIGIN}/locations/${campus.slug}`,
    },
  };

  const friday = campus.services.friday;
  const sunday = campus.services.sunday;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: `[make]new ${friday.name}`,
      description: friday.description.trim(),
      url: `${CANONICAL_ORIGIN}/locations/${campus.slug}`,
      ...base,
      eventSchedule: {
        '@type': 'Schedule',
        repeatFrequency: 'P1W',
        byDay: 'https://schema.org/Friday',
        startTime: '18:30',
        endTime: '20:00',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: `[make]new ${sunday.name} Worship`,
      description: sunday.description.trim(),
      url: `${CANONICAL_ORIGIN}/locations/${campus.slug}`,
      ...base,
      eventSchedule: {
        '@type': 'Schedule',
        repeatFrequency: 'P1W',
        byDay: 'https://schema.org/Sunday',
        startTime: '11:00',
        endTime: '12:00',
      },
    },
  ];
}

/** One-line meta description for a campus detail page. */
export function campusMetaDescription(campus: Campus): string {
  const base = `[make]new at ${campus.university} in ${campus.city}`;
  if (campus.address) {
    return `${base} — Friday and Sunday gatherings at ${campus.address.street}, ${campus.address.city}. College church near Duke.`;
  }
  return `${base} — college-focused campus ministry. Follow us on Instagram for the latest schedule.`;
}
