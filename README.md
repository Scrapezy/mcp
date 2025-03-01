# scrapezy-mcp-server MCP Server

A Model Context Protocol server for Scrapezy API

This MCP server provides tools to extract structured data from websites using Scrapezy's API.

## Features

### Resources
- List and access notes via `note://` URIs
- Each note has a title, content and metadata
- Plain text mime type for simple content access

### Tools
- `create_note` - Create new text notes
  - Takes title and content as required parameters
  - Stores note in server state
- `extract-structured-data` - Extract structured data from a website
  - Takes URL and prompt as required parameters
  - Handles the asynchronous job workflow automatically:
    1. Submits the extraction job to Scrapezy API
    2. Polls the API for job completion (with timeout)
    3. Returns the structured data as JSON text when complete
  - The prompt should clearly describe what data to extract from the website

## Development

Install dependencies:
```bash
npm install
```

Build the server:
```bash
npm run build
```

For development with auto-rebuild:
```bash
npm run watch
```

## Installation and Usage

Install the package:
```bash
npm install -g @scrapezy/mcp
```

### API Key Setup

There are two ways to provide your Scrapezy API key:

1. **Environment Variable:**
   ```bash
   export SCRAPEZY_API_KEY=your_api_key
   npx @scrapezy/mcp
   ```

2. **Command-line Argument:**
   ```bash
   npx @scrapezy/mcp --api-key=your_api_key
   ```

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "scrapezy-mcp-server": {
      "command": "npx @scrapezy/mcp --api-key=your_api_key"
    }
  }
}
```

### Example Usage in Claude

You can use this tool in Claude with prompts like:

```
Please extract product information from this page: https://example.com/product
Extract the product name, price, description, and available colors.
```

Claude will use the MCP server to extract the requested structured data from the website.

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.
