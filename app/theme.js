import createPalette from '@material-ui/core/styles/createPalette'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import createTypography from '@material-ui/core/styles/createTypography'
import overrides from './styles/overrides'

const palette = createPalette({
  default: 'rgba(23,42,58,.7)',
  primary: {
    main: '#29b6f6'
  },
  secondary: {
    main: '#29b6f6'
  }
})

const options = {
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
  color: '#586069',
  '-webkit-font-smoothing': 'antialiased'
}

const typography = createTypography(palette, options)
const theme = createMuiTheme({
  palette,
  typography,
  overrides
})

export default theme
