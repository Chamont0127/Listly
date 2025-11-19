# Listly

A cross-platform list management application with template-based list creation and a unique Matrix dark mode theme.

## Features

- **Template Management**: Create, edit, and manage list templates
- **Swipe-Based List Creation**: Swipe through template items to create custom lists (Tinder-style interaction)
- **Matrix Dark Mode**: Beautiful emerald green glow theme inspired by The Matrix
- **PWA Support**: Installable as a Progressive Web App
- **Cross-Platform**: Works on web browsers (desktop and mobile)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Chamont0127/Listly.git
cd Listly
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on web:
```bash
npm run web
```

## Project Structure

```
Listly/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── navigation/     # Navigation setup
│   ├── database/       # Database schema and migrations
│   ├── services/       # Business logic services
│   ├── context/        # React Context providers
│   ├── theme/          # Theme definitions
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── App.tsx             # Main app component
└── package.json        # Dependencies and scripts
```

## Technology Stack

- **Framework**: React Native Web via Expo
- **Language**: TypeScript
- **Database**: IndexedDB (via Dexie.js)
- **Navigation**: React Navigation
- **Gestures**: React Native Gesture Handler
- **Animations**: React Native Reanimated

## Usage

1. **Create Templates**: Go to Templates screen and create a new template with items
2. **Create Lists**: From the Home screen, select a template and swipe through items to create a list
3. **Manage Lists**: View and check off items in your active lists
4. **Customize Theme**: Switch between Light and Matrix (Dark) themes in Settings

## Testing

Please refer to [TEST_DOCUMENTATION.md](./TEST_DOCUMENTATION.md) for comprehensive testing information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[Specify your license here]
