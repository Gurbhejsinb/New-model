# Design Guidelines: JC TRADERS CAPITAL DEX Swap Dashboard

## Design Approach
**Reference-Based:** PancakeSwap-inspired with modern DeFi aesthetics, clean white interface optimized for financial transactions and data clarity.

## Core Design Principles
- **Trust & Clarity:** Financial transparency through clear typography and precise numerical displays
- **Efficiency:** Streamlined swap flow with minimal clicks and maximum information visibility
- **Professional Identity:** Distinguished from PancakeSwap while maintaining familiar DeFi patterns

## Color Palette

### Light Mode (Primary)
- **Background:** 0 0% 100% (pure white)
- **Surface/Cards:** 0 0% 98% (subtle gray for card elevation)
- **Border:** 0 0% 90% (light gray borders)
- **Primary Brand:** 280 65% 60% (deep purple - JC Traders brand color)
- **Primary Hover:** 280 65% 55%
- **Success (Green):** 142 76% 36% (for positive values, confirmations)
- **Warning (Amber):** 38 92% 50% (for slippage warnings)
- **Danger (Red):** 0 84% 60% (for errors, rejections)
- **Text Primary:** 0 0% 10% (near black)
- **Text Secondary:** 0 0% 45% (medium gray)
- **Text Muted:** 0 0% 60% (light gray for labels)

### Dark Mode Support (Secondary)
- Background: 240 10% 3.9%
- Surface: 240 10% 8%
- Text: 0 0% 95%

## Typography

**Font Stack:** 
- Primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- Monospace (for numbers): 'JetBrains Mono', 'Roboto Mono', monospace

**Scale:**
- Hero/Display: text-4xl (36px) font-bold
- Page Title: text-3xl (30px) font-semibold
- Card Headers: text-xl (20px) font-semibold
- Body/Interface: text-base (16px) font-medium
- Numbers/Values: text-2xl (24px) font-mono font-semibold
- Labels: text-sm (14px) font-medium text-muted
- Fine Print: text-xs (12px)

## Layout System

**Spacing Units:** Tailwind scale of **4, 6, 8, 12, 16, 24** (focused set for consistency)
- Component padding: p-6 or p-8
- Section spacing: gap-6 or gap-8
- Card internal spacing: p-6
- Input/button heights: h-12 to h-14

**Container:**
- Max width: max-w-md (448px) for swap card
- Centered layout: mx-auto
- Page padding: px-4 md:px-6
- Full viewport height: min-h-screen

## Component Library

### Header
- Fixed top bar with white background and subtle bottom border (border-b)
- Left: "JC TRADERS CAPITAL" logo/text (text-xl font-bold text-primary)
- Right: "Connect Wallet" button or connected address display
- Height: h-16 to h-20
- Responsive: stack on mobile if needed

### Swap Card (Primary Component)
- **Container:** Rounded-2xl white card with subtle shadow (shadow-lg)
- **Padding:** p-6 to p-8
- **Width:** w-full max-w-md
- **Sections:**
  - Token input boxes (2): rounded-xl background with border
  - Swap direction icon button (centered, circular, clickable)
  - Conversion rate display (text-sm, between inputs)
  - Settings icon (top-right of card for slippage)
  - Balance display (text-xs, right-aligned under each input)

### Token Input Component
- **Background:** Subtle gray (bg-gray-50) with border
- **Border-radius:** rounded-xl
- **Padding:** p-4
- **Layout:** Flex row with token selector left, amount input right
- **Token Selector:** Button with token icon, symbol, and dropdown arrow
- **Amount Input:** text-2xl font-mono text-right, transparent background

### Buttons
- **Primary (Confirm Swap):** bg-primary text-white rounded-xl h-14 w-full font-semibold hover:bg-primary-hover transition-colors
- **Secondary (Connect):** border-2 border-primary text-primary rounded-xl px-6 h-12 font-semibold hover:bg-primary/5
- **Token Selector:** rounded-lg border bg-white hover:bg-gray-50 px-3 py-2 gap-2 (icon + text)

### Data Display
- **Price Feed:** Fixed position or card showing "BNB: $XXX.XX" with small up/down indicator
- **Conversion Rate:** "1 BNB = X.XXX CAKE" centered, text-sm font-medium
- **Estimated Output:** text-lg font-mono in token input area
- **Slippage:** Badge or pill showing "3% slippage" in settings

### Transaction Feedback
- **Toast/Alert:** Fixed top-right, rounded-xl, with icon + message + close
- **Success:** Green background with checkmark icon
- **Error:** Red background with X icon  
- **Pending:** Amber with spinner
- **Include:** BSCScan link for successful transactions

### Footer
- Simple text: "Powered by PancakeSwap Router"
- Text-xs text-muted
- Centered, py-6

## Visual Enhancements

### Icons
- Use **Heroicons** (outline style) for UI controls
- Token icons from CoinGecko or custom SVG placeholders
- Swap direction: Circular arrow icon (16-20px)
- Settings: Gear icon
- Wallet: Wallet icon

### Interactions
- **Hover states:** Subtle background color changes (bg-gray-50 to bg-gray-100)
- **Focus states:** Ring with primary color (ring-2 ring-primary ring-offset-2)
- **Loading:** Spinner animation on buttons during transactions
- **Disabled:** opacity-50 with cursor-not-allowed

### Micro-animations
- Button hover: 150ms ease transition
- Card entrance: Subtle fade-in on load
- Price updates: Brief highlight flash on value change
- Token switch: 200ms rotation animation on swap icon click

## Accessibility
- High contrast text ratios (4.5:1 minimum)
- Focus indicators on all interactive elements
- Semantic HTML (proper button/input elements)
- ARIA labels for icon buttons
- Error messages associated with form inputs

## Responsive Strategy
- **Mobile (< 768px):** Full-width card with px-4, stack header elements
- **Tablet/Desktop:** Centered card layout, side-by-side header
- Always maintain readable input sizes (minimum 16px to prevent zoom)

## Key Differentiators from Generic DEX
- **Purple brand color** instead of typical blue/teal
- **Professional typography** with clear hierarchy
- **Monospace numbers** for precision and financial credibility
- **Generous whitespace** for reduced cognitive load
- **Clean minimal aesthetic** without gradients or heavy shadows

This design creates a trustworthy, efficient swap interface that balances PancakeSwap familiarity with JC Traders Capital's distinct professional identity.