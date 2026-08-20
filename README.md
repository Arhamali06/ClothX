# ClothX

ClothX is a mobile clothing-store UI built with **React Native**, **TypeScript**, and **Expo**. It is currently a front-end prototype: product, cart, and profile content is local sample data, and the login screen validates input locally rather than connecting to an authentication service.

## Features

- Branded splash screen
- Login form with email and password validation
- Home screen with a promotion banner, clothing categories, and featured products
- Explore screen with product browsing, search, and category filters
- Shopping cart with a sample order summary
- Profile screen with account menu options and logout
- Bottom navigation for Home, Explore, Cart, and Profile
- Responsive mobile-first layout with Expo icons and safe-area support

## Tech stack

- Expo SDK 54
- React 19 and React Native 0.81
- TypeScript
- `@expo/vector-icons` for interface icons
- `react-native-safe-area-context` for safe screen boundaries

## Project structure

```text
ClothX/
|-- App.tsx                 # App flow and active-screen state
|-- src/
|   |-- components/
|   |   `-- BottomNav.tsx   # Bottom navigation bar
|   |-- constants/          # Shared colors and sizing tokens
|   `-- screens/            # Splash, login, home, explore, cart, profile
|-- assets/                 # App, splash, adaptive, and web icons
|-- app.json                # Expo application configuration
`-- package.json            # Scripts and dependencies
```

## Prerequisites

Install the following before running the app:

- [Node.js](https://nodejs.org/) (current LTS recommended; includes npm)
- A phone with the free **Expo Go** app installed:
  - [Android: Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iPhone: App Store](https://apps.apple.com/app/expo-go/id982107779)

For Android emulators, install Android Studio. For iOS Simulator, use macOS with Xcode.

## Installation

Open a terminal in the project folder and install the packages recorded in `package-lock.json`:

```bash
cd ClothX
npm install
```

If you want a clean, lockfile-exact install (for example, after cloning the repository), use:

```bash
npm ci
```

## Run the app

Start the Expo development server:

```bash
npm start
```

This shows a QR code and Expo developer menu in the terminal. You can also run a target directly:

```bash
# Android emulator or connected Android device
npm run android

# iOS Simulator (macOS only)
npm run ios

# Web browser
npm run web
```

## View on a physical phone

1. Run `npm start` from the `ClothX` folder.
2. Connect your computer and phone to the same Wi-Fi network.
3. Open Expo Go on the phone.
4. Scan the QR code shown by Expo:
   - **Android:** use Expo Go's **Scan QR Code** option.
   - **iPhone:** scan it with the iPhone Camera app, then select the Expo Go link.
5. The ClothX app will load on the phone. Changes saved in the source files should refresh automatically.

If the phone cannot connect on your local network, start Expo with a tunnel and scan the new QR code:

```bash
npx expo start --tunnel
```

## Dependencies

The required project dependencies are installed automatically by `npm install`:

| Package | Purpose |
| --- | --- |
| `expo` | Development tools and native runtime configuration |
| `react` | UI component library |
| `react-native` | Native mobile UI framework |
| `expo-status-bar` | Status-bar styling support |
| `@expo/vector-icons` | Ionicons used throughout the interface |
| `react-native-safe-area-context` | Safe-area layout handling |

Development dependencies:

| Package | Purpose |
| --- | --- |
| `typescript` | Type checking for the application |
| `@types/react` | React TypeScript type definitions |

To add an Expo-compatible package later, prefer:

```bash
npx expo install <package-name>
```

Expo will select a version compatible with this project's SDK.

## Current behavior and scope

ClothX is an interface demo and does not yet include a backend, real authentication, payment processing, persistent cart data, or live product images. The login accepts an email containing `@` and a password with at least eight characters, then shows the main app UI.

## Available scripts

| Command | Description |
| --- | --- |
| `npm start` | Start Expo's development server |
| `npm run android` | Open the app on Android |
| `npm run ios` | Open the app on iOS Simulator (macOS required) |
| `npm run web` | Open the app in a web browser |

## Troubleshooting

- **QR code will not open:** confirm the phone and computer share a network, or use `npx expo start --tunnel`.
- **A dependency error appears:** run `npm install` again from the `ClothX` folder.
- **Expo Go reports an SDK mismatch:** update Expo Go from the app store, then restart `npm start`.
- **The app does not refresh:** press `r` in the Expo terminal to reload it.

## License

This project does not currently specify a license.
