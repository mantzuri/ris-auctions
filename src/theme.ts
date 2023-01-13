import { createTheme } from '@mui/system';
import { extendTheme } from '@mui/joy/styles';

const theme = extendTheme({
  components: {
    JoyChip: {
      defaultProps: {
        size: 'sm',
      },
      styleOverrides: {
        root: {
          borderRadius: '4px',
        },
      },
    },
  },
});

export default theme;
