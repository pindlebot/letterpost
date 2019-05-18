export default theme => ({
  main: {
    maxWidth: 720,
    width: '100%',
    margin: '24px auto',
    flexGrow: 1,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '90vw'
    }
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    margin: '0 0 32px 0',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 3,
    border: '1px solid #F5F5F5',
    boxSizing: 'border-box'
  },
  grid: {
    backgroundColor: '#fff',
    borderRadius: 3,
    marginBottom: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px 0 #e6ebf1',
    transition: 'box-shadow 150ms ease',
    padding: '20px'
  },
  left: {
    justifyContent: 'flex-start',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
      marginBottom: 24
    }
  },
  right: {
    justifyContent: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center'
    }
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexBasis: '100%',
    width: '100%'
  },
  half: {
    flexBasis: '48%'
  },
  center: {
    justifyContent: 'center'
  },
  error: {
    border: '1px solid #d73a49 !important'
  },
  thumbnail: {
    border: '1px solid #bdbdbd',
    borderRadius: '3px',
    padding: 6,
    marginRight: 20
  },
  media: {
    width: 136,
    minHeight: 176
  },
  formHelperText: {
    margin: 0
  }
})
