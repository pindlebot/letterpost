export default theme => ({
  button: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    margin: '1em 0'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    flexWrap: 'wrap'
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '50%',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  container: {
  },
  root: {
    width: '100%'
  },
  action: {
    width: '100%'
  },
  actions: {
    justifyContent: 'space-between'
  },
  paper: {
    [theme.breakpoints.down('md')]: {
      height: '100vh',
      width: '100vw'
    },
    [theme.breakpoints.up('md')]: {
      height: '80vh',
      width: '70vw'
    }
  }
})
