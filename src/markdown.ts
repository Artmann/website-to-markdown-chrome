interface FetchMarkdownOptions {
  clean?: boolean
  includeLinks?: boolean
  includeTitle?: boolean
}

const API_BASE_URL =
  'https://website-to-markdown-serverless.artgaard.workers.dev'

export async function fetchMarkdownFromWebsite(
  targetUrl: string,
  options: FetchMarkdownOptions = {}
): Promise<string> {
  const params = new URLSearchParams()

  params.append('url', targetUrl)
  params.append('cleanContent', options.clean ? 'true' : 'false')
  params.append('removeLinks', options.includeLinks ? 'false' : 'true')
  params.append('includeTitle', options.includeTitle ? 'true' : 'false')

  const url = `${API_BASE_URL}?${params.toString()}`

  const response = await fetch(url)

  if (!response.ok) {
    const detail = await readErrorDetail(response)
    throw new Error(
      `Failed to fetch the website content. ${response.status}: ${detail}.`
    )
  }

  return await response.text()
}

async function readErrorDetail(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string }
    if (body.error) {
      return body.error
    }
  } catch {
    // Body wasn't JSON; fall through to statusText.
  }
  return response.statusText
}
