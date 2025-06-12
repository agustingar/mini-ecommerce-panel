import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f8fafc;
    color: #1e293b;
    line-height: 1.6;
  }

  html {
    font-size: 16px;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
    outline: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

// Colores del tema
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  success: {
    50: '#f0fdf4',
    500: '#10b981',
    600: '#059669',
  },
  error: {
    50: '#fef2f2',
    200: '#fecaca',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  white: '#ffffff',
  black: '#000000',
};

// Breakpoints responsivos
export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Utilidades de diseño
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

export const spacing = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
};

// Componentes base reutilizables
export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${spacing.md};

  @media (min-width: ${breakpoints.sm}) {
    padding: 0 ${spacing.lg};
  }

  @media (min-width: ${breakpoints.lg}) {
    padding: 0 ${spacing.xl};
  }
`;

export const Card = styled.div`
  background: ${colors.white};
  border-radius: 0.75rem;
  box-shadow: ${shadows.md};
  overflow: hidden;
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: ${shadows.lg};
  }
`;

export const Button = styled.button<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.xs};
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  text-align: center;
  text-decoration: none;
  
  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return `
          padding: ${spacing.xs} ${spacing.sm};
          font-size: 0.875rem;
          line-height: 1.25rem;
        `;
      case 'lg':
        return `
          padding: ${spacing.md} ${spacing.xl};
          font-size: 1.125rem;
          line-height: 1.75rem;
        `;
      default:
        return `
          padding: ${spacing.sm} ${spacing.lg};
          font-size: 1rem;
          line-height: 1.5rem;
        `;
    }
  }}

  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'secondary':
        return `
          background-color: ${colors.gray[100]};
          color: ${colors.gray[700]};
          border: 1px solid ${colors.gray[300]};
          
          &:hover:not(:disabled) {
            background-color: ${colors.gray[200]};
          }
        `;
      case 'danger':
        return `
          background-color: ${colors.error[500]};
          color: ${colors.white};
          
          &:hover:not(:disabled) {
            background-color: ${colors.error[600]};
          }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          color: ${colors.gray[600]};
          
          &:hover:not(:disabled) {
            background-color: ${colors.gray[100]};
          }
        `;
      default:
        return `
          background-color: ${colors.primary[500]};
          color: ${colors.white};
          
          &:hover:not(:disabled) {
            background-color: ${colors.primary[600]};
          }
        `;
    }
  }}

  ${({ fullWidth }) => fullWidth && 'width: 100%;'}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid ${colors.primary[500]};
    outline-offset: 2px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${colors.gray[300]};
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }

  &::placeholder {
    color: ${colors.gray[400]};
  }

  &:disabled {
    background-color: ${colors.gray[50]};
    color: ${colors.gray[500]};
    cursor: not-allowed;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.gray[700]};
  margin-bottom: ${spacing.xs};
`;

export const ErrorText = styled.span`
  color: ${colors.error[500]};
  font-size: 0.875rem;
  font-weight: 400;
  margin-top: ${spacing.xs};
  display: block;
`;

export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid ${colors.gray[200]};
  border-top: 2px solid ${colors.primary[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`; 