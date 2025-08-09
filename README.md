## Roomble

Production-ready React Native (Expo) roommate matcher app with Azure Functions backend.

### Quick Start

1. Install dependencies
   - Frontend
     - `npm install`
   - Backend
     - `cd backend && npm install`
2. Configure env variables
   - Create `.env` in project root with keys from `.env.sample`
3. Run app
   - `npm run start`
4. Run backend
   - Install Azure Functions Core Tools, then `npm run backend:start`

### Tech

- React Native (Expo + TypeScript), React Navigation
- Redux Toolkit + redux-persist
- Azure Functions (Node + TypeScript), Cosmos DB, Blob Storage
- Azure SignalR, FCM
- Maps, Image Picker/Manipulator

### Scripts

- `npm run start` — start Expo
- `npm run android|ios|web` — run platforms
- `npm run backend:start` — run Azure Functions locally

### Structure

`src/` contains `navigation`, `redux`, `screens`, `services`, `config` (theme)

### Notes

- Error handling via Axios interceptors and defensive UI loaders/alerts
- Form validation using `zod`
- Replace mock endpoints with real Azure integrations


