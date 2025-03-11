# @scrapezy/mcp MCP Server

<a href="https://glama.ai/mcp/servers/rnktqsouvy">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/rnktqsouvy/badge" alt="Scrapezy MCP server" />
</a>

[![smithery badge](https://smithery.ai/badge/@Scrapezy/mcp)](https://smithery.ai/server/@Scrapezy/mcp)

A Model Context Protocol server for [Scrapezy](https://scrapezy.com) that enables AI models to extract structured data from websites.

## Features

### Tools
- `extract_structured_data` - Extract structured data from a website
  - Takes URL and prompt as required parameters
  - Returns structured data extracted from the website based on the prompt
  - The prompt should clearly describe what data to extract from the website

## Installation

### Installing via Smithery

To install Scrapezy MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@Scrapezy/mcp):

```bash
npx -y @smithery/cli install @Scrapezy/mcp --client claude
```

### Manual Installation
```bash
npm install -g @scrapezy/mcp
```

## Usage

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
    "scrapezy": {
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

## License

MIT