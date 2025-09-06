export async function POST(request: Request) {
  const body = await request.text()
  
  // Extract project ID and key from your DSN
  // DSN format: https://ea4573e4db2a42c2900fa3328187fc98@monitor.mikecebul.com/5
  const projectId = '5'
  const secretKey = 'ea4573e4db2a42c2900fa3328187fc98'
  const serverInstance = 'https://monitor.mikecebul.com'
  
  const url = `${serverInstance}/api/${projectId}/envelope/?sentry_version=7&sentry_key=${secretKey}&sentry_client=sentry.javascript.nextjs%2F9.34.0`

  try {
    console.log('Sending to GlitchTip:', url)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
        'Accept': '*/*',
      },
      body,
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      return Response.json({ status: 'error', glitchtip_error: errorText }, { status: response.status })
    }
    
    return Response.json({ status: 'ok' })
  } catch (error) {
    return Response.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}