import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { designTokens } from './designTokens';

export const createAppTheme = (mode = 'light') => {
  const isDark = mode === 'dark';
  const colors = designTokens.colors;
  const bg = designTokens.backgrounds[isDark ? 'dark' : 'light'];
  const glass = designTokens.glass[isDark ? 'dark' : 'light'];
  const borders = designTokens.borders[isDark ? 'dark' : 'light'];
  const shadows = designTokens.shadows[isDark ? 'dark' : 'light'];

  const baseTheme = createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? colors.primary[400] : colors.primary[600],
        light: colors.primary[300],
        dark: colors.primary[700],
        contrastText: colors.primary.contrastText,
      },
      secondary: {
        main: isDark ? colors.secondary[400] : colors.secondary[500],
        light: colors.secondary[300],
        dark: colors.secondary[700],
        contrastText: colors.secondary.contrastText,
      },
      accent: {
        main: colors.accent.rose[500],
        amber: colors.accent.amber[500],
      },
      success: {
        main: colors.success.main,
        light: colors.success.light,
        dark: colors.success.dark,
        contrastText: colors.success.contrastText,
      },
      warning: {
        main: colors.warning.main,
        light: colors.warning.light,
        dark: colors.warning.dark,
        contrastText: colors.warning.contrastText,
      },
      error: {
        main: colors.danger.main,
        light: colors.danger.light,
        dark: colors.danger.dark,
        contrastText: colors.danger.contrastText,
      },
      info: {
        main: colors.info.main,
        light: colors.info.light,
        dark: colors.info.dark,
        contrastText: colors.info.contrastText,
      },
      background: {
        default: bg.canvas,
        paper: bg.surface,
        subtle: bg.subtle,
        elevated: bg.elevated,
        glass: glass.background,
      },
      text: {
        primary: isDark ? '#F9FAFB' : '#0F172A',
        secondary: isDark ? '#9CA3AF' : '#64748B',
        muted: isDark ? '#6B7280' : '#94A3B8',
      },
      divider: borders.subdued,
    },
    typography: {
      fontFamily: designTokens.typography.fontFamily,
      h1: {
        fontSize: designTokens.typography.sizes.h1,
        fontWeight: designTokens.typography.fontWeights.extraBold,
        letterSpacing: '-0.025em',
        lineHeight: designTokens.typography.lineHeights.tight,
      },
      h2: {
        fontSize: designTokens.typography.sizes.h2,
        fontWeight: designTokens.typography.fontWeights.bold,
        letterSpacing: '-0.02em',
        lineHeight: designTokens.typography.lineHeights.snug,
      },
      h3: {
        fontSize: designTokens.typography.sizes.h3,
        fontWeight: designTokens.typography.fontWeights.bold,
        letterSpacing: '-0.015em',
      },
      h4: {
        fontSize: designTokens.typography.sizes.h4,
        fontWeight: designTokens.typography.fontWeights.semibold,
        letterSpacing: '-0.01em',
      },
      h5: {
        fontSize: designTokens.typography.sizes.h5,
        fontWeight: designTokens.typography.fontWeights.semibold,
      },
      h6: {
        fontSize: designTokens.typography.sizes.h6,
        fontWeight: designTokens.typography.fontWeights.semibold,
      },
      subtitle1: {
        fontWeight: designTokens.typography.fontWeights.medium,
        color: isDark ? '#9CA3AF' : '#64748B',
      },
      button: {
        textTransform: 'none',
        fontWeight: designTokens.typography.fontWeights.bold,
        letterSpacing: '0.01em',
      },
    },
    shape: {
      borderRadius: 14,
    },
    shadows: [
      'none',
      shadows.xs,
      shadows.sm,
      shadows.md,
      shadows.lg,
      shadows.xl,
      shadows.glowPrimary,
      shadows.glowAccent,
      shadows.glowSuccess,
      ...Array(16).fill(shadows.md),
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: bg.canvas,
            color: isDark ? '#F9FAFB' : '#0F172A',
            transition: 'background-color 0.25s ease, color 0.25s ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '9px 20px',
            fontSize: '0.925rem',
            fontWeight: 700,
            boxShadow: 'none',
            transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: shadows.glowPrimary,
            },
          },
          containedPrimary: {
            background: isDark
              ? `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[700]} 100%)`
              : `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[800]} 100%)`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            backgroundImage: 'none',
            backgroundColor: glass.background,
            backdropFilter: glass.backdropFilter,
            border: `1px solid ${glass.border}`,
            boxShadow: shadows.sm,
            transition: 'all 0.25s ease',
            '&:hover': {
              borderColor: isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(79, 70, 229, 0.3)',
              boxShadow: `${shadows.md}, ${shadows.glowPrimary}`,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: bg.surface,
            borderRadius: 16,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            fontWeight: 700,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              transition: 'all 0.2s ease',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary[400],
              },
            },
          },
        },
      },
    },
  });

  return responsiveFontSizes(baseTheme);
};

export default createAppTheme('light');
