# ZIFA Player Registration System

A Vue 3 application for the Zimbabwe Football Association (ZIFA) to manage player, coach, and referee registrations.

## Features

- **Player Registration**: Register and manage football players with detailed information
- **Coach Registration**: Register coaches with license levels and certifications
- **Referee Registration**: Register referees with availability status
- **Player Database**: Search and filter players by various criteria
- **User Dashboard**: View statistics, availability, and manage registrations
- **User Authentication**: Login and registration system with role-based access

## Tech Stack

- Vue 3 (Composition API)
- Vue Router
- Pinia (State Management)
- Vite (Build Tool)
- LocalStorage (Data Persistence)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Shared components (Header, Footer, LoginModal, etc.)
│   ├── registration/    # Registration forms (Player, Coach, Referee)
│   └── dashboard/       # Dashboard components (Stats, Availability, etc.)
├── views/               # Page components (Home, PlayerDatabase, etc.)
├── stores/              # Pinia stores (auth, players, coaches, referees)
├── services/            # Services (storage)
├── router/              # Vue Router configuration
├── App.vue              # Root component
└── main.js              # Application entry point
```

## Usage

### Registering a Player

1. Navigate to the Registration page
2. Select "Player Registration" tab
3. Fill in all required fields
4. Submit the form

### Searching Players

1. Navigate to "Player Database"
2. Use the search filters (name, club, position, status, availability)
3. View results in table or card format
4. Click "View" to see player details

### User Dashboard

1. Login or register an account
2. Access the Dashboard to view:
   - Total players, coaches, and referees
   - Available players
   - Quick actions for registration

## Data Storage

All data is stored in the browser's LocalStorage. This means:
- Data persists between sessions
- Data is specific to each browser
- No backend server required

## Default User Roles

- **user**: Regular user with basic access
- **club**: Club administrator with extended privileges
- **admin**: Full administrative access

## Color Scheme

The application uses a green color scheme inspired by football associations:
- Primary Green: #1E7E34
- Dark Green: #155724
- Light Green: #28A745
- Yellow: #FFC107 (accent color)

## License

This project is created for ZIFA (Zimbabwe Football Association).
