# ClothX

ClothX is a mobile-first clothing shopping app built with Expo, React Native, and TypeScript. It combines Supabase email authentication with a DummyJSON product catalog and a local shopping experience for browsing products, managing favorites, building a cart, and reviewing mock orders.

## Highlights

- Branded native and in-app splash screens
- Supabase email/password sign up and sign in
- Persistent Supabase sessions on React Native through AsyncStorage
- Home screen with a promotional banner, product categories, and product catalog
- Explore screen with product search and category filtering
- Product details with size selection, favorites, and add-to-cart actions
- Cart with quantity controls, swipe-to-delete, refresh, order totals, and checkout simulation
- Orders screen with status filters and locally-created orders
- Favorites screen with a two-column product grid
- Profile screen with theme switching, profile editing, and Supabase logout
- Address management UI backed by local mock data
- Light and dark themes
- Custom pill-shaped bottom navigation with cart and favorites badges
- Camera and gallery support for changing the local profile image

## Tech stack

- Expo SDK 54
- React 19
- React Native 0.81
- TypeScript
- React Navigation native stack and bottom tabs
- TanStack React Query for product fetching and caching
- Supabase Auth for email/password authentication
- Axios for DummyJSON API requests
- React Hook Form and Zod for form state and validation
- AsyncStorage for auth session and theme preference persistence
- Expo Camera and Expo Image Picker for profile photos
- Expo Vector Icons for interface icons

## Application architecture

The application is composed through providers in `App.tsx`:

```text
ThemeProvider
`-- QueryClientProvider
    `-- AuthProvider
        `-- FavoritesProvider
            `-- CartProvider
                `-- OrdersProvider
                    `-- RootNavigator
```

### Navigation

The root native stack contains the authentication flow and secondary screens:

- `Splash`
- `Login`
- `Signup`
- `MainTabs`
- `Favorites`
- `Orders`
- `Addresses`
- `Settings`
- `EditProfile`
- `ProductDetails`

`MainTabs` contains the four primary tabs:

- `Home`
- `Explore`
- `Cart`
- `Profile`

### Authentication flow

1. The app opens on the splash screen.
2. `AuthContext` restores any persisted Supabase session.
3. The splash screen sends authenticated users to `MainTabs` and unauthenticated users to `Login`.
4. Signup creates a Supabase Auth user using an email, password, and full-name metadata.
5. Signup always returns to the login screen after showing a success or email-confirmation message.
6. Login uses the same email and password, then sends a successful user to `MainTabs`.
7. Logout calls `supabase.auth.signOut()` and resets navigation to `Login`.

If Supabase email confirmation is enabled, the user must confirm the address before signing in. For local practice, email confirmation can be disabled in the Supabase dashboard under **Authentication > Providers > Email**.

### Data sources and persistence

| Area | Current implementation |
| --- | --- |
| Authentication | Supabase Auth |
| Product catalog | DummyJSON API at `https://dummyjson.com` |
| Search | DummyJSON product search endpoint |
| Cart | In-memory React context, initialized from a DummyJSON cart |
| Favorites | In-memory React context |
| Orders | In-memory React context with mock initial order |
| Addresses | Local mock state |
| Theme preference | AsyncStorage |
| Auth session | Supabase plus AsyncStorage |
| Profile edits | In-memory auth context state |

Cart, favorites, orders, addresses, and profile edits are not currently synchronized with a backend or restored after a complete app data reset.

## Requirements

- Node.js LTS with npm
- A physical Android or iOS device with Expo Go, or an installed emulator/simulator
- Android Studio for Android emulator development
- Xcode on macOS for iOS simulator development
- A Supabase project for authentication

## Installation

From the project directory:

```bash
cd ClothX
npm install
```

For a clean install based exactly on the lockfile:

```bash
npm ci
```

## Environment variables

Create a `.env` file in the project root. Do not commit it:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your-publishable-key
```

The app reads these variables in `src/services/supabase.ts`. Expo public variables are bundled into the client, so use the Supabase publishable/anonymous key intended for frontend use. Never place a Supabase service-role key in this file or in a mobile build.

The repository ignores `.env` and `.env*.local` through `.gitignore`.

### Supabase setup

1. Create a Supabase project.
2. Open **Project Settings > API**.
3. Copy the project URL and publishable key into `.env`.
4. Open **Authentication > Providers > Email**.
5. Enable the Email provider.
6. For a practice-only flow, disable **Confirm email** so new accounts can sign in immediately without a real inbox.

Supabase may rate-limit repeated signup attempts when confirmation emails are enabled. Wait for the limit to reset and avoid repeatedly submitting the signup form.

## Running the app

Start the Expo development server:

```bash
npm start
```

Then scan the QR code with Expo Go. The phone and development computer should normally be on the same network.

Available scripts:

| Command | Purpose |
| --- | --- |
| `npm start` | Start the Expo development server |
| `npm run android` | Run through the Android native target |
| `npm run ios` | Run through the iOS native target on macOS |
| `npm run web` | Start the Expo web target |
| `npx expo start --tunnel` | Start Expo through a tunnel when local networking fails |
| `npx tsc -p tsconfig.json --noEmit` | Type-check the project |
| `npx expo config --type public` | Print the resolved Expo configuration |

If Expo Go does not refresh correctly, press `r` in the Expo terminal or restart the development server with a cleared cache:

```bash
npx expo start -c
```

## Android and iOS builds

The project includes an `eas.json` configuration with development, preview, and production profiles.

Install and authenticate with EAS CLI when you need installable builds:

```bash
npm install -g eas-cli
eas login
```

Build an internal Android preview APK:

```bash
eas build -p android --profile preview
```

Build a development client:

```bash
eas build -p android --profile development
```

Expo Go does not use the standalone app launcher icon. Changes to `app.json` icons, adaptive icons, splash assets, and native permissions appear in a rebuilt native application, not in the Expo Go launcher itself.

## Project structure

```text
ClothX/
|-- App.tsx                         # Provider composition and app entry
|-- index.ts                        # Expo entry point
|-- app.json                        # Expo app, icon, splash, and permission config
|-- eas.json                        # EAS build profiles
|-- package.json                    # Scripts and dependencies
|-- tsconfig.json                   # TypeScript configuration
|-- assets/
|   |-- icon.png                    # App and Android adaptive icon asset
|   |-- splash-icon.png             # Legacy splash asset kept in assets
|   |-- adaptive-icon.png           # Legacy adaptive icon asset kept in assets
|   `-- favicon.png                 # Web favicon
`-- src/
    |-- api/
    |   `-- api.ts                  # Axios client for DummyJSON
    |-- components/
    |   |-- BottomNav.tsx            # Custom pill bottom navigation
    |   |-- GoogleLogo.tsx            # Social button logo
    |   `-- ProductCard.tsx           # Reusable product card
    |-- constants/
    |   |-- colors.ts                # Light and dark palettes
    |   `-- sizes.ts                 # Spacing, typography, and layout tokens
    |-- context/
    |   |-- AuthContext.tsx           # Supabase user/session state
    |   |-- CartContext.tsx           # Cart state and totals
    |   |-- FavoritesContext.tsx      # Favorites state
    |   |-- OrdersContext.tsx         # Mock orders and checkout results
    |   `-- ThemeContext.tsx          # Theme state and persistence
    |-- navigation/
    |   |-- BottomTabNavigator.tsx   # Main tab navigator
    |   `-- RootNavigator.tsx        # Root authentication and app stack
    |-- screens/                     # Auth, catalog, account, and commerce screens
    |-- services/
    |   |-- authService.ts           # Supabase auth operations and user mapping
    |   |-- cartServices.ts          # DummyJSON cart API helpers
    |   |-- productService.ts        # DummyJSON product and search requests
    |   `-- supabase.ts              # Supabase client configuration
    `-- types/
        |-- cart.ts                  # Cart API types
        |-- navigation.ts            # Navigation route types
        `-- products.ts              # Product types
```

## Troubleshooting

### Signup says email rate limit exceeded

Supabase is limiting confirmation email delivery. Disable email confirmation for a practice project, wait for the limit to reset, and avoid repeated submissions.

### Signup succeeds but login is rejected

Check whether email confirmation is enabled. If it is enabled, confirm the account first. Also verify that the email and password meet the form validation rules.

### Environment variables are undefined

Confirm that `.env` is in the project root, the names are exactly `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_KEY`, and restart Expo after changing the file.

### The app shows old native icon or splash assets

Native assets are applied when the native app is built. Rebuild the preview or development client after changing `app.json`; clearing the Metro cache alone does not update an installed launcher icon.

### The QR code does not connect

Make sure the phone and computer share a network, then try:

```bash
npx expo start --tunnel
```

### The API catalog does not load

The product and cart screens use the public DummyJSON service. Check the device connection and inspect the error state shown by the screen.

## Current limitations

- This is a commerce UI prototype, not a production checkout system.
- Checkout creates a local mock order and does not process a payment.
- Cart, favorites, orders, addresses, and profile edits are not backed by Supabase.
- Product and initial cart data depend on DummyJSON availability.
- Google and Apple buttons are visual placeholders and do not start OAuth flows.
- The filter icon on Explore is presentational; category filtering and search are implemented.
- There is no automated test suite or lint script configured yet.
- No license is currently specified for the project.

## Security notes

- Keep `.env` out of Git and out of screenshots or public issue reports.
- Use only a Supabase publishable/anonymous client key in the mobile app.
- If a secret key is ever committed, rotate it in Supabase immediately and remove it from repository history.
- Do not trust client-side validation as a replacement for server-side authorization.
