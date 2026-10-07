# TouchGrass AI

TouchGrass AI is a web application that uses local open-weight AI to generate personalized outdoor missions.

The goal is simple:

> Spend less time staring at a screen and more time experiencing the real world.

## What It Does

The user chooses:

- Available time
- Preferred outdoor activity
- Energy level
- Current mood
- Whether they are alone, with friends, or with family

TouchGrass AI then generates a personalized outdoor mission.

The user can start the mission, put their phone away, complete the activity, and earn Grass XP.

## Why Local AI?

TouchGrass AI uses an open-weight AI model running locally through Ollama.

Current model:

**Llama 3.2 3B**

The AI generation happens locally instead of sending every request to a cloud AI API.

Benefits:

- Better privacy
- No per-request API cost
- Local inference
- Model flexibility
- Open-weight AI experimentation

## Tech Stack

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Node.js
- Express.js

### AI

- Ollama
- Llama 3.2 3B

### Storage

- Browser LocalStorage

## How It Works

```text
User
  ↓
HTML / CSS / JavaScript
  ↓
Express.js Backend
  ↓
Ollama
  ↓
Llama 3.2 3B
  ↓
Personalized Outdoor Mission
  ↓
User Goes Outside
  ↓
Mission Completed
  ↓
Grass XP + Streak



## Screenshots

### Homepage

![TouchGrass AI Homepage](screenshots/01-homepage.png)

### AI Generated Mission

![AI Generated Mission](screenshots/02-ai-mission.png)

### Touch Grass Mode

![Touch Grass Mode](screenshots/03-touch-grass-mode.png)

### Grass Score

![Grass Score](screenshots/04-progress.png)

### Mission History

![Mission History](screenshots/05-progress-history.png)