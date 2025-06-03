import { CircleAlert, Copy, Download, Loader } from 'lucide-react'
import { useCallback, useEffect, useState, type ReactElement } from 'react'

import { Button } from './components/ui/button'
import { Checkbox } from './components/ui/checkbox'
import { Textarea } from './components/ui/textarea'
import { cn } from './lib/utils'
import { fetchMarkdownFromWebsite } from './markdown'
import { Toaster } from './components/ui/sonner'
import { toast } from 'sonner'

export function App(): ReactElement {
  const [markdown, setMarkdown] = useState('')
  const [url, setUrl] = useState<string>()
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string>()

  const [includeTitle, setIncludeTitle] = useState(true)
  const [includeLinks, setIncludeLinks] = useState(true)
  const [cleanContent, setCleanContent] = useState(true)

  const updateUrl = useCallback(() => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      (tabs) => {
        if (tabs.length === 0) {
          return
        }

        const currentTab = tabs[0]

        const url = currentTab.url

        setUrl(url)
      }
    )
  }, [])

  const handleCopy = useCallback(() => {
    if (!markdown) {
      return
    }

    navigator.clipboard.writeText(markdown).then(() => {
      console.log('Markdown copied to clipboard')

      toast('Markdown copied to clipboard')
    })
  }, [markdown])

  const handleDownload = useCallback(() => {
    if (!markdown) {
      return
    }

    let filename = 'content.md'

    if (url) {
      try {
        const urlObj = new URL(url)
        const pathname = urlObj.pathname
        const lastSegment = pathname.split('/').filter(Boolean).pop()

        if (lastSegment && lastSegment !== '') {
          // Remove any file extensions and clean up the filename
          const cleanName = lastSegment
            .replace(/\.[^/.]+$/, '') // Remove file extension
            .replace(/[^a-zA-Z0-9-]/g, '-') // Replace non-alphanumeric chars with dashes
            .replace(/-+/g, '-') // Replace multiple dashes with single dash
            .replace(/^-|-$/g, '') // Remove leading/trailing dashes

          if (cleanName) {
            filename = `${cleanName}.md`
          }
        }
      } catch (error) {
        console.warn('Failed to generate filename from URL:', error)
      }
    }

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)

    toast('Markdown downloaded')
  }, [markdown, url])

  useEffect(
    function fetchMarkdownOnUrlChange() {
      console.log(`URL changed to ${url}`)

      if (!url) {
        return
      }

      setError(undefined)
      setIsFetching(true)

      fetchMarkdownFromWebsite(url, {
        clean: cleanContent,
        includeLinks,
        includeTitle
      })
        .then((newMarkdown) => {
          console.log('Markdown fetched:', newMarkdown)

          setMarkdown(newMarkdown)
        })
        .catch((error) => {
          console.error('Error fetching markdown:', error)

          setError(error.message)
        })
        .finally(() => {
          setIsFetching(false)
        })
    },
    [cleanContent, includeLinks, includeTitle, url]
  )

  useEffect(
    function detectUrl() {
      const urlChangedHandler = () => {
        updateUrl()
      }

      updateUrl()

      chrome.tabs.onUpdated.addListener(urlChangedHandler)

      return () => {
        chrome.tabs.onUpdated.removeListener(urlChangedHandler)
      }
    },
    [updateUrl]
  )

  return (
    <div
      className="flex flex-col gap-4 p-4 text-gray-700"
      style={{ width: 'calc(24rem + 2rem)' }}
    >
      <Toaster />

      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-black">
          Website as Markdown
        </h2>

        <div className="flex gap-4 items-center">
          <div className="text-xs flex items-center gap-2">
            <Checkbox
              checked={includeTitle}
              id="title"
              onCheckedChange={(checked) => {
                setIncludeTitle(Boolean(checked))
              }}
            />
            <label htmlFor="title">Title</label>
          </div>

          <div className="text-xs flex items-center gap-2">
            <Checkbox
              checked={includeLinks}
              id="links"
              onCheckedChange={(checked) => {
                setIncludeLinks(Boolean(checked))
              }}
            />
            <label htmlFor="links">Links</label>
          </div>

          <div className="text-xs flex items-center gap-2">
            <Checkbox
              checked={cleanContent}
              id="clean"
              onCheckedChange={(checked) => {
                setCleanContent(Boolean(checked))
              }}
            />
            <label htmlFor="clean">Clean</label>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <Button
            className="cursor-pointer"
            size="icon"
            variant="outline"
            onClick={handleDownload}
          >
            <Download className="size-3 text-gray-500" />
          </Button>
          <Button
            className="cursor-pointer"
            size="icon"
            variant="outline"
            onClick={handleCopy}
          >
            <Copy className="size-3 text-gray-500" />
          </Button>
        </div>
        <Textarea
          className="w-[24rem] h-[28rem] text-xs"
          value={markdown}
        />
      </div>

      <div className={cn(error ? 'text-red-700' : 'text-gray-700', 'text-xs')}>
        {error ? (
          <div className="w-full h-full flex items-center gap-2">
            <CircleAlert className="size-3" /> <span>{error}</span>
          </div>
        ) : isFetching ? (
          <div className="w-full h-full flex items-center gap-2">
            <Loader className="size-3" /> <span>Fetching content</span>
          </div>
        ) : (
          ' '
        )}
      </div>
    </div>
  )
}
