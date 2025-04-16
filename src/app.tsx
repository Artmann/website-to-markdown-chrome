import { useCallback, useEffect, useState, type ReactElement } from 'react'

import { fetchMarkdownFromWebsite } from './markdown'
import { Textarea } from './components/ui/textarea'

export function App(): ReactElement {
  const [markdown, setMarkdown] = useState('')
  const [url, setUrl] = useState<string>()

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

  useEffect(
    function fetchMarkdownOnUrlChange() {
      console.log(`URL changed to ${url}`)

      if (!url) {
        return
      }

      fetchMarkdownFromWebsite(url)
        .then((newMarkdown) => {
          console.log('Markdown fetched:', newMarkdown)

          setMarkdown(newMarkdown)
        })
        .catch((error) => {
          console.error('Error fetching markdown:', error)
        })
    },
    [url]
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
      className="flex flex-col gap-4 p-4"
      style={{ width: 'calc(24rem + 2rem)' }}
    >
      <h2 className="text-sm font-semibold">Website as Markdown</h2>

      <div className="text-xs">
        <Textarea
          className="w-[24rem] h-[32rem]"
          value={markdown}
        />
      </div>
    </div>
  )
}
