/**
 * RestaurantOS Design System Tokens
 * Master source of truth for colors, typography, spacing, radius, shadows, animations, and layout parameters.
 */

export const designTokens = {
  // 1. Color Palette
  colors: {
    primary: {
      50: '#EEF2FF',
      100: '#E0E7FF',
      200: '#C7D2FE',
      300: '#A5B4FC',
      400: '#818CF8',
      500: '#6366F1', // Core
      600: '#4F46E5', // Main brand
      700: '#4338CA',
      800: '#3730A3',
      900: '#312E81',
      contrastText: '#FFFFFF',
    },
    secondary: {
      50: '#ECFEFF',
      100: '#CFFAFE',
      200: '#A5F3FC',
      300: '#67E8F9',
      400: '#22D3EE',
      500: '#06B6D4',
      600: '#0891B2',
      700: '#0E7490',
      800: '#155E75',
      900: '#164E63',
      contrastText: '#FFFFFF',
    },
    accent: {
      rose: {
        300: '#FDA4AF',
        400: '#FB7185',
        500: '#F43F5E',
        600: '#E11D48',
        700: '#BE123C',
      },
      amber: {
        300: '#FCD34D',
        400: '#FBBF24',
        500: '#F59E0B',
        600: '#D97706',
        700: '#B45309',
      },
      contrastText: '#FFFFFF',
    },
    success: {
      light: '#34D399',
      main: '#10B981',
      dark: '#059669',
      bgLight: '#ECFDF5',
      bgDark: 'rgba(16, 185, 129, 0.15)',
      contrastText: '#FFFFFF',
    },
    warning: {
      light: '#FBBF24',
      main: '#F59E0B',
      dark: '#D97706',
      bgLight: '#FFFBEB',
      bgDark: 'rgba(245, 158, 11, 0.15)',
      contrastText: '#FFFFFF',
    },
    danger: {
      light: '#F87171',
      main: '#EF4444',
      dark: '#DC2626',
      bgLight: '#FEF2F2',
      bgDark: 'rgba(239, 68, 68, 0.15)',
      contrastText: '#FFFFFF',
    },
    info: {
      light: '#60A5FA',
      main: '#3B82F6',
      dark: '#2563EB',
      bgLight: '#EFF6FF',
      bgDark: 'rgba(59, 130, 246, 0.15)',
      contrastText: '#FFFFFF',
    },
  },

  // 2. Backgrounds
  backgrounds: {
    light: {
      canvas: '#F8FAFC',
      surface: '#FFFFFF',
      subtle: '#F1F5F9',
      elevated: '#FFFFFF',
      overlay: 'rgba(15, 23, 42, 0.4)',
    },
    dark: {
      canvas: '#090D16',
      surface: '#111827',
      subtle: '#1F2937',
      elevated: '#1E293B',
      overlay: 'rgba(0, 0, 0, 0.75)',
    },
  },

  // 3. Glassmorphism
  glass: {
    light: {
      background: 'rgba(255, 255, 255, 0.82)',
      border: 'rgba(255, 255, 255, 0.6)',
      hoverBackground: 'rgba(99, 102, 241, 0.06)',
      backdropFilter: 'blur(16px) saturate(180%)',
    },
    dark: {
      background: 'rgba(17, 24, 39, 0.78)',
      border: 'rgba(255, 255, 255, 0.08)',
      hoverBackground: 'rgba(99, 102, 241, 0.15)',
      backdropFilter: 'blur(16px) saturate(180%)',
    },
  },

  // 4. Borders
  borders: {
    light: {
      subdued: '#E2E8F0',
      default: '#CBD5E1',
      focus: '#6366F1',
    },
    dark: {
      subdued: 'rgba(255, 255, 255, 0.08)',
      default: '#374151',
      focus: '#818CF8',
    },
  },

  // 5. Typography
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    codeFamily: '"Fira Code", "JetBrains Mono", Consolas, monospace',
    fontWeights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extraBold: 800,
    },
    sizes: {
      display: '2.75rem',  // 44px
      h1: '2.25rem',       // 36px
      h2: '1.75rem',       // 28px
      h3: '1.375rem',      // 22px
      h4: '1.125rem',      // 18px
      h5: '1rem',          // 16px
      h6: '0.875rem',      // 14px
      bodyLg: '1.125rem',  // 18px
      bodyMd: '0.9375rem', // 15px
      bodySm: '0.8125rem', // 13px
      caption: '0.75rem',  // 12px
    },
    lineHeights: {
      tight: 1.2,
      snug: 1.35,
      normal: 1.5,
      relaxed: 1.65,
    },
  },

  // 6. Spacing Scale
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },

  // 7. Radius Scale
  radius: {
    none: '0px',
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    '2xl': '28px',
    full: '9999px',
  },

  // 8. Shadow System
  shadows: {
    light: {
      xs: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
      sm: '0 2px 4px 0 rgba(15, 23, 42, 0.06)',
      md: '0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.04)',
      lg: '0 12px 24px -4px rgba(15, 23, 42, 0.12), 0 4px 8px -2px rgba(15, 23, 42, 0.04)',
      xl: '0 20px 32px -8px rgba(15, 23, 42, 0.16), 0 8px 16px -4px rgba(15, 23, 42, 0.06)',
      glowPrimary: '0 8px 24px -4px rgba(99, 102, 241, 0.35)',
      glowAccent: '0 8px 24px -4px rgba(244, 63, 94, 0.35)',
      glowSuccess: '0 8px 24px -4px rgba(16, 185, 129, 0.35)',
      glowDanger: '0 8px 24px -4px rgba(239, 68, 68, 0.35)',
    },
    dark: {
      xs: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
      sm: '0 2px 4px 0 rgba(0, 0, 0, 0.6)',
      md: '0 4px 16px rgba(0, 0, 0, 0.6)',
      lg: '0 12px 28px rgba(0, 0, 0, 0.75)',
      xl: '0 20px 40px rgba(0, 0, 0, 0.85)',
      glowPrimary: '0 8px 28px rgba(99, 102, 241, 0.45)',
      glowAccent: '0 8px 28px rgba(244, 63, 94, 0.45)',
      glowSuccess: '0 8px 28px rgba(16, 185, 129, 0.45)',
      glowDanger: '0 8px 28px rgba(239, 68, 68, 0.45)',
    },
  },

  // 9. Animation System
  animations: {
    durations: {
      fast: '150ms',
      normal: '250ms',
      slow: '400ms',
    },
    easings: {
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  // 10. Global Layout System (STEP 2)
  layout: {
    breakpoints: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
    sidebar: {
      expanded: 260,
      collapsed: 72,
      mobile: 280,
    },
    navbar: {
      desktopHeight: 70,
      mobileHeight: 60,
    },
    contentWidth: {
      standard: 1280,
      wide: 1440,
      full: '100%',
    },
    containerPadding: {
      desktop: '32px',
      tablet: '24px',
      mobile: '16px',
    },
    grid: {
      columns: 12,
      gaps: {
        desktop: '24px',
        tablet: '16px',
        mobile: '12px',
      },
    },
  },
};

export default designTokens;
