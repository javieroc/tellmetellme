import { strapi } from '@strapi/client';

const API_BASE = import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const client = strapi({ baseURL: API_BASE });

export function getStrapiMedia(url: string | null | undefined) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  // strip possible trailing /api from API_BASE if present, then prefix
  return `${API_BASE}${url}`;
}