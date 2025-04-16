# CLAUDE.md - Development Guidelines

## Build and Lint Commands

- `bun dev` - Start development server
- `bun run build` - Build for production
- `bun lint` - Run ESLint checks
- `bun format` - Format code with Prettier
- `bun preview` - Preview production build

## Code Style

- Use TypeScript with strict mode
- Format with Prettier
- Follow React functional component patterns
- Use React hooks according to eslint-plugin-react-hooks rules
- No unused locals or parameters
- No unchecked side effect imports
- Use Tailwind CSS for styling
- Prefer utility classes over custom CSS

## TypeScript

- Target ES2020 for app, ES2022 for node
- Use bundler module resolution
- Enforce strict type checking
- JSX: react-jsx format

## Error Handling

- Use typed error handling
- Avoid unchecked exceptions
- Handle async errors with try/catch

## Naming Conventions

- PascalCase for components
- camelCase for variables and functions
- Use descriptive, semantic names
- Prefix hooks with 'use'
