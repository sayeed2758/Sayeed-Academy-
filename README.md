# Sayeed Academy — Free V2

## Goal
A premium course-learning web app that can be hosted free on GitHub Pages.

## Current free architecture
- Frontend: HTML + CSS + JavaScript
- Hosting: GitHub Pages
- Video: YouTube Unlisted/normal YouTube URL embedded in the app
- PDFs/resources: Telegram links can be opened from the app
- Data: LocalStorage
- PWA: included
- No Supabase
- No paid database
- No bot token in frontend

## Your course
Course: Learn to Sell Digital Products Using AI on Automation

Demo modules:
1. Getting Started
2. AI Product Creation
3. Automation
4. Selling & Scaling

## How video playback works
Open Admin → Video & PDF links and paste a YouTube video URL. The first demo lesson receives that URL and the Play button appears in the course modal. The app converts supported YouTube URLs to an embedded player.

YouTube videos are not copied into GitHub. GitHub only contains the website code.

## Telegram PDFs/resources
Paste a Telegram resource URL in Admin. The app opens it in a new tab. For private-channel content, the viewer must already have access to the channel. The app does not bypass Telegram permissions.

## Important
Do not put private Telegram bot tokens, API hashes, passwords or other secrets in GitHub/frontend code.

## GitHub Pages
Upload all files/folders in this ZIP to a repository. Enable GitHub Pages from repository Settings → Pages. Open the published site URL.

## Future phases
- Better admin lesson editor (video/PDF per lesson)
- Course thumbnail upload/management
- Multiple courses
- Free/premium access logic
- Cloud sync
- User login
- Telegram Mini App
- Native Android packaging

The current version is deliberately backend-free so the base app can remain free.
