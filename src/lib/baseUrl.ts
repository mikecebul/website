export const baseUrl = (
  (typeof process !== 'undefined' ? process.env.SERVER_URL : undefined) ||
  import.meta.env?.VITE_SERVER_URL ||
  'https://www.mikecebul.com'
).replace(/\/+$/, '')
