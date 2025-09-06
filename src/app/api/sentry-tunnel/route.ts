export async function POST(request: Request) {
  const body = await request.text()
  
  // Extract project ID and key from your DSN
  // DSN format: https://9c880f7160a4463db3cdd151bb2b3a91@monitor.mikecebul.com/4
  const projectId = '4'
  const secretKey = '9c880f7160a4463db3cdd151bb2b3a91'
  const serverInstance = 'https://monitor.mikecebul.com'
  
  const url = `${serverInstance}/api/${projectId}/envelope/?sentry_version=7&sentry_key=${secretKey}&sentry_client=sentry.javascript.nextjs%2F10.10.0`

  try {
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
    }

    return Response.json({ status: 'ok' })
  } catch (error) {
    return Response.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}