# ToolHub

A modern, sleek web application that hosts multiple utility tools under one roof. Built with Next.js and Tailwind CSS.

## Available Tools

- **Password Generator** - Create strong, secure passwords with customizable parameters (length, character types).
- **Color Palette Generator** - Create beautiful color schemes using different harmony rules (analogous, monochromatic, etc).
- **Markdown Editor** - Write and preview markdown with a clean interface, featuring split view and syntax highlighting.

## Coming Soon

- **URL Shortener** - Create shortened links that redirect to longer URLs.
- **YouTube Revenue Predictor** - Estimate potential earnings based on view count, engagement, and niche.
- **Image Optimizer** - Compress and optimize images for web use without significant quality loss.
- **SEO Analyzer** - Basic SEO analysis tool for websites.
- **QR Code Generator** - Create customizable QR codes for URLs, text, or contact information.
- **Text Case Converter** - Convert text between different case formats (camelCase, snake_case, etc.).
- **Lorem Ipsum Generator** - Generate placeholder text with customizable length.
- **Code Formatter** - Format code snippets in various programming languages.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Tech Stack

- **Framework:** Next.js
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **Deployment:** Can be deployed to Vercel, Netlify, or any static hosting

## Project Structure

- `src/app` - Contains the main application code
- `src/app/password-generator` - Password Generator tool
- `src/app/color-palette` - Color Palette Generator tool
- `src/app/markdown-editor` - Markdown Editor tool
- `src/components` - Reusable UI components

## Features

- Responsive design that works on mobile, tablet, and desktop
- Modern, intuitive UI with subtle animations
- Client-side processing (no server requirements)
- Accessible components following best practices

## Future Improvements

- Add user accounts to save generated content
- Add themes and dark mode
- Create an API for programmatic access to tools 