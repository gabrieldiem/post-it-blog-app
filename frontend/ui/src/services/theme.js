import { createTheme } from '@mui/material/styles';

const VIOLET_PRIMARY = "#a757e4";
const VIOLET_SECONDARY = "#a757e4";

const themeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: VIOLET_PRIMARY,
    },
    secondary: {
      main: VIOLET_SECONDARY,
    },
  },
};

const violetTheme = createTheme(themeOptions);

export default violetTheme;
