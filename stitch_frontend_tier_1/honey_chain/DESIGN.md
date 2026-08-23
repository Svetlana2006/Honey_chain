---
name: Honey Chain
colors:
  surface: '#f9f9f8'
  surface-dim: '#dadad9'
  surface-bright: '#f9f9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f3'
  surface-container: '#eeeeed'
  surface-container-high: '#e8e8e7'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#514532'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1f0'
  outline: '#837560'
  outline-variant: '#d5c4ab'
  surface-tint: '#7c5800'
  primary: '#7c5800'
  on-primary: '#ffffff'
  primary-container: '#ffb800'
  on-primary-container: '#6b4c00'
  inverse-primary: '#ffba20'
  secondary: '#2b6954'
  on-secondary: '#ffffff'
  secondary-container: '#adedd3'
  on-secondary-container: '#306d58'
  tertiary: '#855300'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffb657'
  on-tertiary-container: '#734800'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdea8'
  primary-fixed-dim: '#ffba20'
  on-primary-fixed: '#271900'
  on-primary-fixed-variant: '#5e4200'
  secondary-fixed: '#b0f0d6'
  secondary-fixed-dim: '#95d3ba'
  on-secondary-fixed: '#002117'
  on-secondary-fixed-variant: '#0b513d'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f9f9f8'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-data:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system is built upon the intersection of organic provenance and digital immutability. It serves a dual audience: the conscious consumer seeking purity and the supply chain professional requiring technical precision. The aesthetic balances **Agricultural Trust** with **High-Tech Transparency**.

The visual direction follows a **Modern Corporate** foundation enhanced by **Subtle Glassmorphism**. This combination creates a "Laboratory Purity" feel—clean, sterile backgrounds (ivory) interrupted by warm, organic focal points (honey ambers) and technical verification layers (translucency and blurs). The interface should feel premium, reliable, and scientifically verified.

## Colors

The palette is rooted in the "Forest to Hive" narrative. 

- **Honey Ambers (#FFB800, #F59E0B):** Used primarily for action states, verification badges, and highlighting product quality. These colors represent the energy and value of the honey.
- **Deep Forest Greens (#064E3B, #065F46):** These provide the professional, grounded weight of the brand. Used for navigation, headings, and representing the agricultural origin.
- **Laboratory Ivory (#FAFAF9):** The primary background color. It is cooler and cleaner than a traditional "cream," evoking a sense of clinical purity and high-tech food safety standards.

## Typography

Inter is utilized for its systematic, neutral character which supports the blockchain/tech narrative. 

- **Headlines:** Use tight letter-spacing and Semi-Bold weights in Forest Green to establish authority.
- **Data Display:** For blockchain hashes or batch numbers, use a slightly reduced font size with increased tracking to mimic a technical, monospaced feel while remaining within the sans-serif family for readability.
- **Labels:** Uppercase labels are used for metadata descriptions (e.g., "POLLEN COUNT," "HIVE COORDINATES") to reinforce the laboratory report aesthetic.

## Layout & Spacing

The layout uses a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **Structure:** Content is organized into modular cards that follow a strict 8px spacing scale. 
- **Vertical Rhythm:** Large whitespace (80px+) is used between major sections to maintain the "Minimalist" and "Professional" brand pillars.
- **Data Density:** Within technical "Verification" sections, the spacing tightens to 12px (sm) to allow for comparative data reading, similar to a lab result or financial ledger.

## Elevation & Depth

This design system uses **Tonal Layers** combined with **Glassmorphism** to represent transparency.

- **Surface Levels:** The base layer is Ivory (#FAFAF9). Elevated cards use pure White (#FFFFFF) with an extremely subtle, wide-spread shadow (Alpha 4%) to lift them.
- **The "Verification" Glass:** For overlays, tooltips, or blockchain status updates, use a backdrop-blur (12px to 20px) with a semi-transparent white fill (opacity 70%). These elements should have a thin, 1px border in a lightened Forest Green at 10% opacity to define the edge without adding visual weight.
- **Z-Axis:** Low-elevation shadows are preferred to maintain a flat, modern, and high-tech feel.

## Shapes

The shape language is "Soft-Technical." 

- **Standard Radius:** 0.5rem (8px) is the default for buttons, cards, and input fields. This provides enough roundness to feel organic and approachable without losing the precision of a professional tool.
- **Iconography:** Icons should feature consistent stroke weights (2px) and slightly rounded terminals to match the UI components.

## Components

- **Buttons:** Primary buttons use the Honey Amber (#FFB800) with Forest Green text for high contrast. Secondary buttons use a Forest Green outline. "Verify" buttons should incorporate a small "Check" icon to reinforce the brand promise.
- **Verification Cards:** Special card type for blockchain data. Features a Glassmorphic background and a subtle Forest Green left-border accent to indicate "Verified" status.
- **Chips:** Used for honey notes (e.g., "Floral," "Manuka," "Raw"). These use a soft Amber background (10% opacity) with dark Amber text.
- **Input Fields:** Minimalist design with a 1px Forest Green bottom border that transitions to a full 1px Forest Green outline on focus. Labels should be small and positioned above the field.
- **Status Indicators:** Use a pulsating dot animation for "Live Ledger" updates, signifying active blockchain connectivity.
- **Certificates:** A dedicated UI component that mimics a physical document but with digital flourishes (QR codes, cryptographic hashes) to bridge the agricultural/tech gap.