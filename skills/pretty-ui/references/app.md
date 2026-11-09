# Mobile app screens

Apply these on top of the chosen design system when the target is a phone app, in any stack: React Native and Expo, SwiftUI, Jetpack Compose, Flutter, or HTML mockups at 390×844.

## Structure

- **One task per screen.** Each screen has one primary action, placed in the bottom half where the thumb reaches.
- **Navigation:** a bottom tab bar for three to five top-level destinations; a back button and a title for everything below them. No hamburger menu for a handful of destinations.
- **Large titles** on top-level screens, standard titles on detail screens.
- **Safe areas:** keep content clear of the status bar, notch or Dynamic Island, and the home indicator. Tab bars sit above the home indicator.

## Sizes

| | iOS | Android |
| --- | --- | --- |
| Minimum touch target | 44 × 44 pt | 48 × 48 dp |
| Body text | 17 pt | 16 sp |
| Screen side padding | 16–24 pt | 16–24 dp |
| Tab bar height | 49 pt plus the home indicator | 64–80 dp |

Use the app system's own values when it sets them (`app.touchTarget`, `app.screenPadding`, `app.tabBar`).

## Platform conventions

- **iOS:** SF Symbols or a matching icon set, sheets for secondary tasks, swipe back, Dynamic Type support.
- **Android:** Material Symbols, the system back gesture, a top app bar, Material 3 components when the project already uses them.
- **Cross-platform (React Native, Flutter):** follow the platform the user names; if they name none, follow iOS for layout and keep touch targets at 48.

## States every app screen needs

- Empty: what this screen is for and the one action that fills it.
- Loading: skeletons in the shape of the content, not a spinner in the middle of a blank screen.
- Error: what went wrong in plain words, and a retry.
- Offline, when the app needs the network.

## Numbers

Apps for running, money, health and time are read at a glance. Set the key number large, with tabular figures, and its unit smaller next to it. Keep one key number per card.
