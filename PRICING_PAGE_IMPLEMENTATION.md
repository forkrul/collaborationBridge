# Pricing Page Implementation

This document describes the implementation of the 3-tier pricing page for the application.

## Overview

A comprehensive pricing page has been implemented with the following features:
- **3 pricing tiers**: Starter (Free), Professional ($29/month), Enterprise ($99/month)
- **Responsive design** using existing UI components
- **Internationalization support** with translations
- **Theme-aware styling** that adapts to the app's theme system
- **Configuration-driven** approach using JSON configuration

## Files Created/Modified

### Configuration
- `config/pricing.json` - Main pricing configuration with tiers, features, and pricing data

### Components
- `frontend/src/components/ui/pricing-card.tsx` - Reusable pricing card component
- `frontend/src/app/[locale]/pricing/page.tsx` - Main pricing page

### Types
- `frontend/src/types/index.ts` - Added pricing-related TypeScript types

### Translations
- `frontend/src/i18n/locales/en-GB/common.json` - English pricing translations
- `frontend/src/i18n/locales/de/common.json` - German navigation translation

### Navigation
- `frontend/src/components/layout/Header.tsx` - Added pricing link to navigation

### Utilities
- `frontend/src/lib/utils.ts` - Created utility functions (cn for class merging)

## Features

### Pricing Tiers

1. **Starter (Free)**
   - Up to 3 users
   - 5GB storage
   - 3 projects
   - Community support
   - 1,000 API calls/month

2. **Professional ($29/month)**
   - Up to 25 users
   - 100GB storage
   - Unlimited projects
   - Email support
   - 50,000 API calls/month
   - Advanced analytics
   - **Most Popular** badge

3. **Enterprise ($99/month)**
   - Unlimited users
   - 1TB storage
   - Unlimited projects
   - Dedicated account manager
   - Unlimited API calls
   - All advanced features

### Key Features

- **Billing Toggle**: Monthly/Yearly with 17% discount for yearly billing
- **Feature Comparison**: Clear visual indicators for included/excluded features
- **Responsive Design**: Works on all screen sizes
- **Internationalization**: Supports multiple languages
- **Theme Integration**: Uses the app's existing theme system
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Configuration Structure

The pricing configuration in `config/pricing.json` includes:

```json
{
  "tiers": [
    {
      "id": "starter",
      "name": "Starter",
      "description": "Perfect for individuals and small projects",
      "price": { "monthly": 0, "yearly": 0, "currency": "USD" },
      "popular": false,
      "features": [...],
      "cta": { "text": "Get Started", "variant": "outline" }
    }
  ],
  "billing": {
    "periods": ["monthly", "yearly"],
    "yearlyDiscount": 0.17,
    "currency": "USD"
  }
}
```

### Component Usage

```tsx
import { PricingComparison } from '@/components/ui/pricing-card';
import pricingData from '../../../config/pricing.json';

<PricingComparison
  tiers={pricingData.tiers}
  billingPeriod="monthly"
  yearlyDiscount={0.17}
  onSelectPlan={(tierId) => console.log('Selected:', tierId)}
/>
```

## Internationalization

The pricing page supports multiple languages through the next-intl system:

- Navigation labels
- Pricing tier names and descriptions
- Feature names
- Call-to-action buttons
- FAQ section
- Billing period labels

### Adding New Languages

To add pricing translations for a new language:

1. Add navigation translation in `frontend/src/i18n/locales/[locale]/common.json`:
```json
{
  "navigation": {
    "pricing": "Your Translation"
  }
}
```

2. Add full pricing translations following the structure in the English file.

## Customization

### Adding New Pricing Tiers

1. Add new tier to `config/pricing.json`
2. Add translations for the new tier
3. The component will automatically render the new tier

### Modifying Features

1. Update the features array in the tier configuration
2. Add feature name translations to the locale files
3. Features automatically show as included/excluded with visual indicators

### Styling Customization

The pricing cards use the existing design system:
- CSS variables for theming
- Tailwind classes for styling
- Consistent with other UI components

## Testing

The pricing page can be tested by:

1. Starting the development server: `cd frontend && npm run dev`
2. Navigating to `http://localhost:3000/pricing`
3. Testing different languages using the language switcher
4. Testing theme changes
5. Testing responsive design on different screen sizes

## Future Enhancements

Potential improvements:
- Integration with payment processing
- User subscription management
- Plan comparison table
- Testimonials section
- Pricing calculator for custom plans
- A/B testing for different pricing strategies

## Dependencies

The pricing page uses existing dependencies:
- Next.js 14 with App Router
- next-intl for internationalization
- Tailwind CSS for styling
- Radix UI components
- Lucide React for icons
