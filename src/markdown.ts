interface FetchMarkdownOptions {
  includeTitle?: boolean
  includeLinks?: boolean
  clean?: boolean
}

export async function fetchMarkdownFromWebsite(targetUrl: string, options: FetchMarkdownOptions = {}): Promise<string> {
  const baseUrl = 'https://urltomarkdown.herokuapp.com'
  const params = new URLSearchParams()

  params.append('url', targetUrl)

  if (options.includeTitle) {
    params.append('title', 'true')
  }

  if (options.includeLinks) {
    params.append('links', 'true')
  }

  if (options.clean) {
    params.append('clean', 'true')
  }

  const url = `${baseUrl}?${params.toString()}`

  const response = await fetch(url)

  const markdown = await response.text()

  if (!response.ok) {
    throw new Error(`Failed to fetch the website content. ${response.status}: ${response.statusText}.`)
  }

  return markdown
}