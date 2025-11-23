# ts-boundaries-cli

> A TypeScript architectural boundary enforcement tool that analyzes import statements to prevent unwanted dependencies between different parts of your codebase.

## Installation

```bash
pnpm install ts-boundaries-cli
```

Or use directly with `npx` et al.:

```bash
pnpm dlx ts-boundaries-cli init
pnpm dpx ts-boundaries-cli check
```

## Quick Start

1. Initialize configuration:

```bash
ts-boundaries init
```

This creates a `ts-boundaries.config.json` file with an empty rules array.

2. Add rules to your config:

```json
{
  "$schema": "https://raw.githubusercontent.com/maxwihlborg/ts-boundaries-cli/refs/heads/main/schema.json",
  "rules": [
    {
      "from": ["./src/!(shared|server)/**"],
      "disallow": ["./src/server/**"],
      "message": "Client code cannot import from server code"
    },
    {
      "from": ["./src/shared/**"],
      "disallow": ["./src/!(shared)/**"],
      "message": "Shared code can only import shared code"
    },
    {
      "from": ["./src/server/**"],
      "disallow": ["./src/!(shared|server)/**"],
      "message": "Server code cannot import from client code"
    }
  ]
}
```

3. Check your codebase:

```bash
ts-boundaries check
```

## Configuration

### Basic Rules

Rules define which imports are forbidden from specific locations:

```json
{
  "rules": [
    {
      "from": ["./src/components/**"],
      "disallow": ["./src/utils/internal/**"],
      "message": "Components should not import internal utilities"
    }
  ]
}
```

### Path Aliases

Configure path aliases for import resolution:

```json
{
  "resolve": {
    "alias": {
      "~": "./src",
      "@components": "./src/components",
      "@utils": "./src/utils"
    }
  }
}
```

This allows the tool to properly resolve imports like `~/components/Button` to `./src/components/Button`.

### Ignoring Specific Imports

You can opt-out of boundary checking for specific imports using the `// ts-boundaries-ignore` comment:

```typescript
// ts-boundaries-ignore
import { ServerAPI } from "../server/api"; // This import will be ignored

import { ClientUtils } from "../client/utils"; // This import will still be checked

// ts-boundaries-ignore
const serverModule = await import("../server/auth"); // Dynamic import ignored too
```

The comment must appear directly before the import statement and works with both static imports and dynamic `import()` calls.

## Commands

### `ts-boundaries init`

Creates a new configuration file with an empty rules array.

### `ts-boundaries check`

Analyzes your TypeScript files and reports boundary violations.

Options:

- `--vimgrep`: Output errors in vimgrep format

## Output Formats

### Default Format

Human-readable output with detailed error information:

```
./src/client/app.ts:5:10
  Client code cannot import from server code
  Import: src/server/api

[ERROR] Found 1 fence violation(s)
```

### Vimgrep Format

Machine-readable format compatible with vim quickfix and other tools:

```bash
ts-boundaries check --vimgrep
```

Output:

```
/Users/user/projects/package/src/client/app.ts:5:10: Client code cannot import from server code
```

## Use Cases

### Layered Architecture

Enforce architectural layers (presentation, business, data):

```json
{
  "rules": [
    {
      "from": ["./src/presentation/**"],
      "disallow": ["./src/data/**"],
      "message": "Presentation layer cannot directly access data layer"
    },
    {
      "from": ["./src/data/**"],
      "disallow": ["./src/presentation/**"],
      "message": "Data layer cannot depend on presentation layer"
    }
  ]
}
```

### Feature-Based Boundaries

Prevent features from importing from each other:

```json
{
  "rules": [
    {
      "from": ["./src/features/auth/**"],
      "disallow": ["./src/features/billing/**"],
      "message": "Auth feature cannot import from billing feature"
    },
    {
      "from": ["./src/features/billing/**"],
      "disallow": ["./src/features/auth/**"],
      "message": "Billing feature cannot import from auth feature"
    }
  ]
}
```

## Integration

### CI/CD

Add to your build process:

```yaml
# GitHub Actions
- name: Check boundaries
  run: pnpm dlx ts-boundaries-cli check
```

```bash
# npm script
{
  "scripts": {
    "lint:boundaries": "ts-boundaries check"
  }
}
```

### Vim/Neovim

Use vimgrep format for quickfix integration:

```vim
:cexpr system('pnpm dlx ts-boundaries-cli check --vimgrep')
```

## License

MIT
