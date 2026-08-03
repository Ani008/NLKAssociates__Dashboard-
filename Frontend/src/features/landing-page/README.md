# NLK Associates Law Firm Landing Page Feature

This folder contains a fully isolated, self-contained public marketing landing page for **Adv. Narayan L. Khamkar & Associates**.

## What's Inside

- **`LandingPage.jsx`**: The entire self-contained feature component. It includes all components, hooks, content data, and dynamic stylesheet injection scoped under `.nlk-landing-root`.

## How to Render It

You can import and render this component safely anywhere in the React router/application without any style bleed-through:

```jsx
import LandingPage from "./features/landing-page/LandingPage";

// ... inside your router or page configuration:
<Route path="/" element={<LandingPage />} />
```

## Styling & Isolation Guarantee

1. All styling is wrapped under the `.nlk-landing-root` class namespace.
2. It uses `react-icons` for vector-based icon elements.
3. AOS scroll animations and scoped CSS stylesheet are initialized and injected dynamically during component mounting.
