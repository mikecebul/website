export const baseUrl = (
  (typeof process !== 'undefined'
    ? process.env.VITE_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL
    : undefined) ||
  import.meta.env?.VITE_SERVER_URL ||
  'https://www.mikecebul.com'
).replace(/\/+$/, '')
