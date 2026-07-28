# UI_DESIGN_SYSTEM.md — RestaurantOS Design System

## Design Tokens (`src/styles/designTokens.js`)

### Color Palette

| Token | Light Value | Dark Value | Purpose |
|---|---|---|---|
| `primary.main` | `#4F46E5` (Indigo 600) | `#6366F1` (Indigo 500) | Core brand color |
| `primary.500` | `#6366F1` | `#818CF8` | Active states & glows |
| `secondary.main` | `#06B6D4` (Cyan) | `#22D3EE` | Accent color |
| `success.main` | `#10B981` (Emerald) | `#34D399` | Positive indicators, active status |
| `warning.main` | `#F59E0B` (Amber) | `#FBBF24` | Alerts, pending status |
| `danger.main` | `#EF4444` (Rose) | `#F87171` | Errors, deletions, expired |
| `info.main` | `#3B82F6` (Blue) | `#60A5FA` | Informational badges |

### Backgrounds & Surfaces

| Token | Light | Dark |
|---|---|---|
| `canvas` | `#F8FAFC` | `#090D16` |
| `surface` | `#FFFFFF` | `#111827` |
| `subtle` | `#F1F5F9` | `#1F2937` |
| `elevated` | `#FFFFFF` | `#1E293B` |
| `overlay` | `rgba(15, 23, 42, 0.4)` | `rgba(0, 0, 0, 0.75)` |

### Glassmorphism System
```css
/* Glass Card styling */
background: var(--glass-bg, rgba(255, 255, 255, 0.82));
border: 1px solid var(--border-subdued, rgba(255, 255, 255, 0.6));
backdrop-filter: blur(16px) saturate(180%);
-webkit-backdrop-filter: blur(16px) saturate(180%);
```

### Typography Scale
- **Font Family**: `"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, sans-serif`
- **Code Family**: `"Fira Code", "JetBrains Mono", Consolas, monospace`
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (ExtraBold)

### Layout Scale
- **Sidebar Expanded**: `260px`
- **Sidebar Collapsed**: `72px`
- **Sidebar Mobile**: `280px`
- **Navbar Desktop**: `70px`
- **Navbar Mobile**: `60px`
- **Max Content Width**: `1440px`
- **Padding**: `32px` (desktop), `24px` (tablet), `16px` (mobile)

---

## Component System (`src/components/ui/`)

1. **`Button`**: Supports `primary`, `secondary`, `outlined`, `ghost`, `danger`, `glow`
2. **`Card` & `GlassCard`**: Styled cards with custom elevation and border tokens
3. **`StatCard`**: Dashboard KPI card with icon, metric, trend indicator
4. **`Table`**: Custom DataGrid with pagination, column rendering, empty state
5. **`Modal`**: Dialog wrapper for CRUD forms
6. **`Badge`**: Status badge with dot indicator
7. **`Loader`**: Circular spinner & skeleton states
8. **`Toast`**: Custom React-Toastify configuration
