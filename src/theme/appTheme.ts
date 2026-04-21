import { createTheme } from '@mui/material/styles';

/**
 * Keeps MUI landing/auth widgets visually aligned with legacy CSS in auth.css / HomePage.css.
 * Emotion injects after bundled CSS; overrides here reliably beat default component styles.
 */
export const appTheme = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.landing-headline': {
            margin: '0 0 16px',
            fontSize: 'clamp(26px, 3.5vw, 38px)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#111827',
          },
          '&.landing-lead': {
            margin: '0 0 24px',
            fontSize: 17,
            lineHeight: 1.55,
            color: '#4b5563',
            maxWidth: '520px',
          },
          '&.landing-header-tagline': {
            margin: 0,
            fontSize: 13,
            fontWeight: 500,
            color: '#6b7280',
            textAlign: 'right',
            lineHeight: 1.35,
          },
          '&.landing-logo-text': {
            margin: 0,
            fontSize: 22,
            fontWeight: 800,
            color: '#ff7a00',
            letterSpacing: '-0.02em',
          },
          '&.landing-demo': {
            margin: 0,
            fontSize: 14,
            lineHeight: 1.5,
            color: '#6b7280',
            maxWidth: '540px',
          },
          '&.landing-auth-title': {
            margin: '0 0 6px',
            fontSize: 22,
            fontWeight: 700,
            color: '#151517',
            textAlign: 'left',
          },
          '&.landing-auth-subtitle': {
            margin: '0 0 20px',
            fontSize: 14,
            color: '#6e6e74',
            textAlign: 'left',
            lineHeight: 1.45,
          },
          '&.auth-legend': { marginBottom: '10px' },
          '&.auth-field-error': { margin: '6px 0 0' },
          '&.auth-password-policy-msg': { margin: '0 0 8px' },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.auth-mui-field-root': {
            boxSizing: 'border-box',
            width: '100%',
            maxWidth: '100%',
            border: '1px solid #e6e6ea',
            borderRadius: '10px',
            background: '#fff',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            '&:hover:not(.Mui-disabled)': {
              borderColor: '#d8d8de',
            },
            '&.Mui-focused': {
              borderColor: '#ff7a00',
              boxShadow: '0 0 0 3px rgba(255, 122, 0, 0.15)',
            },
            '&.Mui-disabled': {
              opacity: 0.65,
              cursor: 'not-allowed',
            },
            '&:has(.MuiInputBase-input[aria-invalid="true"])': {
              borderColor: '#ff7875',
              boxShadow: '0 0 0 3px rgba(255, 77, 79, 0.14)',
            },
            '& .MuiInputBase-input': {
              display: 'block',
              width: '100%',
              maxWidth: '100%',
              padding: '11px 14px',
              fontSize: '15px',
              color: '#151517',
              borderRadius: '10px',
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#a8a8ae',
              opacity: 1,
            },
            '& .MuiInputBase-input:focus': {
              outline: 'none',
            },
          },
          '&.auth-mui-field-root.auth-mui-password-field .MuiInputBase-input': {
            paddingRight: '44px',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&.auth-password-toggle': {
            position: 'absolute',
            right: '4px',
            top: '50%',
            transform: 'translateY(-50%)',
            margin: 0,
            padding: 0,
            width: '36px',
            height: '36px',
            border: 'none',
            borderRadius: '8px',
            background: 'transparent',
            color: '#6e6e74',
            display: 'grid',
            placeItems: 'center',
            '&:hover:not(.Mui-disabled)': {
              color: '#ff7a00',
              background: 'rgba(255, 122, 0, 0.08)',
            },
            '&.Mui-focusVisible': {
              outline: 'none',
              color: '#ff7a00',
              boxShadow: '0 0 0 2px rgba(255, 122, 0, 0.35)',
            },
            '&.Mui-disabled': {
              opacity: 0.5,
            },
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          '&.auth-checkbox': {
            margin: 0,
            alignItems: 'center',
            gap: '8px',
            '& .MuiFormControlLabel-label': {
              fontSize: '14px',
              color: '#55555b',
              userSelect: 'none',
            },
            '& .MuiCheckbox-root': {
              padding: 0,
              marginRight: 0,
              color: '#ff7a00',
              '&.Mui-checked': { color: '#ff7a00' },
              '& .MuiSvgIcon-root': { fontSize: 18 },
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.auth-link': {
            minWidth: 0,
            padding: 0,
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: 'inherit',
            color: '#ff7a00',
            textTransform: 'none',
            textDecoration: 'none',
            background: 'none',
            border: 'none',
            borderRadius: 0,
            boxShadow: 'none',
            '&:hover': {
              textDecoration: 'underline',
              background: 'none',
              boxShadow: 'none',
            },
          },
          '&.auth-submit': {
            marginTop: '4px',
            width: '100%',
            padding: '12px 18px',
            fontSize: '15px',
            fontWeight: 600,
            lineHeight: 'normal',
            color: '#fff',
            textTransform: 'none',
            backgroundColor: '#ff7a00',
            border: 'none',
            borderRadius: '10px',
            boxShadow: 'none',
            transition: 'background 0.15s ease, transform 0.1s ease',
            '&:hover': {
              backgroundColor: '#e86e00',
              boxShadow: 'none',
            },
            '&:active': {
              transform: 'scale(0.99)',
            },
            '&.Mui-disabled': {
              opacity: 0.65,
              color: '#fff',
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          '&.auth-alert': {
            padding: '10px 12px',
            borderRadius: '10px',
            fontSize: '14px',
            lineHeight: 1.4,
            alignItems: 'flex-start',
            '& .MuiAlert-icon': {
              display: 'none',
              padding: 0,
              margin: 0,
            },
            '& .MuiAlert-message': {
              padding: 0,
              width: '100%',
              overflow: 'visible',
            },
          },
          '&.auth-alert.auth-alert-success': {
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
            color: '#389e0d',
          },
          '&.auth-alert.auth-alert-error': {
            backgroundColor: '#fff1f0',
            border: '1px solid #ffccc7',
            color: '#a61d24',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '&.landing-auth-tabs': {
            minHeight: 0,
            '& .MuiTabs-scroller': { overflow: 'visible' },
            '& .MuiTabs-flexContainer': {
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 0,
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '.landing-auth-tabs &': {
            maxWidth: 'none',
            minWidth: 0,
            minHeight: 0,
            width: '100%',
            border: 'none',
            background: 'transparent',
            padding: '10px 14px',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: 'normal',
            color: '#6b7280',
            borderRadius: '10px',
            textTransform: 'none',
            opacity: 1,
            '&.Mui-selected, &.is-active': {
              background: '#fff',
              color: '#111827',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
            },
          },
        },
      },
    },
  },
});
