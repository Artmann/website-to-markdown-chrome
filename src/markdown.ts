interface FetchMarkdownOptions {
  clean?: boolean
  includeLinks?: boolean
  includeTitle?: boolean
}

export async function fetchMarkdownFromWebsite(
  targetUrl: string,
  options: FetchMarkdownOptions = {}
): Promise<string> {
  const devBaseUrl =
    'https://tbev3n4g6gnq6hqjlqaatndr3u0pgxij.lambda-url.us-east-1.on.aws'
  const prodBaseUrl =
    'https://52ebc42gkz64z7nffzsuliusri0qzaxm.lambda-url.us-east-1.on.aws'
  const baseUrl =
    process.env.NODE_ENV === 'production' ? prodBaseUrl : devBaseUrl

  const params = new URLSearchParams()

  params.append('url', targetUrl)

  params.append('cleanContent', options.clean ? 'true' : 'false')
  params.append('removeLinks', options.includeLinks ? 'false' : 'true')
  params.append('includeTitle', options.includeTitle ? 'true' : 'false')

  const url = `${baseUrl}?${params.toString()}`

  const response = await fetch(url)

  const markdown = await response.text()

  if (!response.ok) {
    throw new Error(
      `Failed to fetch the website content. ${response.status}: ${response.statusText}.`
    )
  }

  return markdown
}
