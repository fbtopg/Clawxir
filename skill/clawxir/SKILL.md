# Clawxir Skill

Visualize your OpenClaw bot's architecture in real-time with circuit-style animations.

## Features

- Real-time circuit visualization
- Privacy-first design
- Customizable themes
- Shareable patterns
- No sensitive data collection

## Installation

```bash
clawhub install clawxir
```

## Configuration

In your OpenClaw configuration:

```json
{
  "skills": {
    "clawxir": {
      "enabled": true,
      "visualization": {
        "mode": "minimal",
        "theme": "dark",
        "animationSpeed": 1
      },
      "privacy": {
        "sharePatterns": false,
        "anonymousStats": false
      }
    }
  }
}
```

## Usage

```javascript
// Your bot will automatically generate circuit visualizations
// No additional code needed!

// Optional: Share a pattern
clawxir.sharePattern('my-pattern');

// Optional: Customize visualization
clawxir.updateTheme({
  background: '#1a1a1a',
  nodes: {
    model: '#7c3aed'
  }
});
```