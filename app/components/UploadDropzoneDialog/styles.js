const styles = theme => ({
  icon: {
    marginRight: '10px'
  },
  toggleButtonGroup: {
    justifyContent: 'space-between',
    boxShadow: 'none'
  },
  toggleButton: {
    flexBasis: '50%',
    width: '50%'
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
  },
  dialogContent: {
    maxHeight: 'calc(80vh - 53px - 68px)',
    boxSizing: 'border-box',
    overflowY: 'hidden'
  },
  dialogContentRow: {
    display: 'flex',
    flexDirection: 'row',
    margin: '0 -15px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      margin: 0
    }
  },
  dialogContentColumn: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '50%',
    padding: '0 15px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      margin: 0,
      flexBasis: 'unset'
    }
  },
  fileInput: {
    display: 'none'
  }
})

export default styles
