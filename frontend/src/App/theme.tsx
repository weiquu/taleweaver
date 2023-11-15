import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  initialColorMode: 'light',
  useSystemColorMode: false,
  components: {
    Alert: {
      baseStyle: (props) => {
        const baseProps = {
          container: {
            borderRadius: '10px',
          },
        };
        return {
          ...baseProps,
        };
      },
    },

    Input: {
      defaultProps: {
        focusBorderColor: 'brand.orange',
      },
    },

    Textarea: {
      defaultProps: {
        focusBorderColor: 'brand.orange',
      },
    },

    Select: {
      defaultProps: {
        focusBorderColor: 'brand.orange',
      },
    },
    Slider: {
      defaultProps: {
        colorScheme: 'red',
      },
    },
    Checkbox: {
      defaultProps: {
        colorScheme: 'orange',
      },
    },
    Heading: {
      baseStyle: {
        letterSpacing: '2px',
        textAlign: 'center',
      },
    },
    Button: {
      baseStyle: {
        fontStyle: 'normal',
      },
      // 1. We can update the base styles
      variants: {
        styled: {
          appearance: 'none',
          borderRadius: '40em',
          borderStyle: 'solid',
          borderColor: 'brand.white',
          borderWidth: '1px',
          boxSizing: 'border-box',
          fontFamily: '-apple-system, sans-serif',
          fontSize: '1.2rem',
          fontWeight: '600',
          letterSpacing: '-.24px',
          margin: 0,
          outline: 'none',
          padding: '1.3rem 1.6rem',
          textAlign: 'center',
          textDecoration: 'none',
          transition: 'all .15s',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'manipulation',
          bgColor: '#FFFFFF',
          color: '#000000',
          cursor: 'pointer',
          boxShadow: '0 -12px 6px #ADCFFF inset',

          _hover: {
            bgColor: '#FFC229',
            boxShadow: '0 -6px 8px #FF6314 inset',
            transform: 'scale(1.125)',
          },
          _active: {
            transform: 'scale(1.025)',
          },
          _mediaQueries: {
            '(min-width: 768px)': {
              fontSize: '1.5rem',
              padding: '.75rem 2rem',
            },
          },
        },

        'styled-color': {
          appearance: 'none',
          borderRadius: '40em',
          borderStyle: 'none',
          boxSizing: 'border-box',
          fontFamily: '-apple-system, sans-serif',
          fontSize: '1.2rem',
          fontWeight: '500',
          letterSpacing: '-.24px',
          margin: 0,
          outline: 'none',
          padding: '1.3rem 1.6rem',
          textAlign: 'center',
          textDecoration: 'none',
          transition: 'all .15s',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'manipulation',
          bgColor: '#FF6314',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 -12px 6px #da521c inset',

          _hover: {
            bgColor: '#FFC229',
            boxShadow: '0 -6px 8px #FF6314 inset',
            transform: 'scale(1.125)',
          },
          _active: {
            transform: 'scale(1.025)',
          },
          _mediaQueries: {
            '(min-width: 768px)': {
              fontSize: '1.5rem',
              padding: '.75rem 2rem',
            },
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        color: '#40211F',
      },
    },
  },
  colors: {
    brand: {
      dark: '#40211F',
      orange: '#F96317',
      orange80: '#FF7833',
      yellow: '#FFC229',
      green: '#06D6A0',
      white: '#ECECEC',
    },
  },
  fonts: {
    heading: `'Paytone One', sans-serif`,
    body: `'Kumbh Sans', sans-serif`,
  },
});

export default theme;
