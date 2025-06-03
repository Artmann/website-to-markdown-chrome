# Website to Markdown - Chrome Extension

A Chrome extension that converts web pages to Markdown format with customizable
options.

## Features

- Convert any web page to clean Markdown
- Customize conversion options:
  - Include/exclude page title
  - Include/exclude links
  - Clean up content for better readability
- Copy Markdown to clipboard with one click
- Simple, responsive UI

## Installation

1. Clone this repository
2. Install dependencies:
   ```
   bun install
   ```
3. Build the extension:
   ```
   bun run build
   ```
4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` directory

## Development

Start the development server:

```
bun dev
```

### Commands

- `bun dev` - Start development server
- `bun run build` - Build for production
- `bun lint` - Run ESLint checks
- `bun format` - Format code with Prettier
- `bun preview` - Preview production build

## Contributing

Contributions are welcome! Here's how to contribute:

1. Fork the repository
2. Create your feature branch:
   ```
   git checkout -b feature/my-new-feature
   ```
3. Make your changes and ensure tests and linting pass:
   ```
   bun lint
   bun run build
   ```
4. Commit your changes
5. Push to your branch:
   ```
   git push origin feature/my-new-feature
   ```
6. Create a Pull Request

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Chrome Extension API

## License

[MIT License](LICENSE)
