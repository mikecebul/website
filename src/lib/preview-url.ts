export function getPreviewOrigin(request: { url?: string; headers: Headers }, serverURL: string) {
  const configuredURL = new URL(serverURL)
  const url = new URL(request.url || serverURL)
  const forwardedProtocol = request.headers.get('x-forwarded-proto')?.split(',')[0].trim()

  // TLS terminates at the production proxy, so the internal request can be HTTP.
  if (forwardedProtocol === 'https' || forwardedProtocol === 'http') {
    url.protocol = `${forwardedProtocol}:`
  } else if (url.host === configuredURL.host) {
    url.protocol = configuredURL.protocol
  }

  return url.origin
}
