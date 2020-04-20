import palette from './palette';
import typography from './typography';
import overrides from './overrides';
import { createMuiTheme } from '@material-ui/core/styles';

/*
declare module '@material-ui/core/styles/createMuiTheme' {
    export interface Theme {
        //palette: any;
    }
    // allow configuration using `createMuiTheme`
    export interface ThemeOptions {
        //palette: any;
    }
}
*/

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    white?: any;
    neutral?: any;
    icon?: any;
  }
}

const theme = createMuiTheme({
  palette,
  typography,
  overrides,
  zIndex: {
    appBar: 1200,
    drawer: 1100,
  },
});

export default theme;
