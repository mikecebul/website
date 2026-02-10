'use server'

export async function checkSentryConnectivity(): Promise<boolean> {
  try {
    const response = await fetch('https://monitor.mikecebul.com/api/0/projects/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.SENTRY_AUTH_TOKEN}`,
      },
    })
    return response.ok
  } catch (error) {
    return false
  }
}