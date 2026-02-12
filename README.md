# Clawxir

✨ Real-time circuit visualization for OpenClaw bots

## Quick Start

```bash
clawhub install clawxir
```

That's it! Now visit [clawxir.vercel.app](https://clawxir.vercel.app) and click "Visualize My Bot".

## Features

- 🔄 Real-time circuit visualization
- 🎨 Beautiful animated data flows
- 🚀 One-click connection
- 🔒 Privacy-first design
- 🎯 Zero configuration

## Examples

![Circuit Example](public/example-1.png)
*Real-time circuit visualization*

![Flow Example](public/example-2.png)
*Animated data flows*

## How It Works

1. Install the skill
2. Click "Visualize My Bot" on [clawxir.vercel.app](https://clawxir.vercel.app)
3. Watch your bot's architecture come to life!

## Customization

```javascript
// Optional: Customize the visualization
clawxir.updateTheme({
  background: '#1a1a1a',
  nodes: {
    model: '#7c3aed',
    tool: '#2563eb'
  }
});
```

## Privacy

- Only visualizes architecture
- No access to messages or sensitive data
- All processing happens locally

## Built With

- Next.js
- Supabase
- TypeScript
- Tailwind CSS