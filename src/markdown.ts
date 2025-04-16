interface FetchMarkdownOptions {
  clean?: boolean
  includeLinks?: boolean
  includeTitle?: boolean
}

export async function fetchMarkdownFromWebsite(targetUrl: string, options: FetchMarkdownOptions = {}): Promise<string> {
  const baseUrl = 'https://urltomarkdown.herokuapp.com'
  const params = new URLSearchParams()

  params.append('url', targetUrl)

  params.append('clean', options.clean ? 'true' : 'false')
  params.append('links', options.includeLinks ? 'true' : 'false')
  params.append('title', options.includeTitle ? 'true' : 'false')

  const url = `${baseUrl}?${params.toString()}`

  const response = await fetch(url)

  const markdown = await response.text()

  if (!response.ok) {
    throw new Error(`Failed to fetch the website content. ${response.status}: ${response.statusText}.`)
  }

  return markdown
}