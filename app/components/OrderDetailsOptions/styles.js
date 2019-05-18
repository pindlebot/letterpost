const styles = theme => ({
  root: {
    flexBasis: '100%',
    background: theme.palette.background.paper
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  item: {
    flexBasis: '50%'
  },
  right: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
})

export default styles
