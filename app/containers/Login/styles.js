import pattern from '../../styles/pattern'

export default {
  container: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#fafafa',
    position: 'absolute',
    padding: '10% 80px 10% 80px',
    boxSizing: 'border-box'
  },
  inset: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: 'rgba(23, 28, 33, 0.06) 0px 4px 9px 0px',
  },
  left: {
    padding: '5%',
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  right: {
    backgroundClip: 'border-box',
    width: 'calc(100% - 400px)',
    borderTopRightRadius: '5px',
    borderBottomRightRadius: '5px',
    // backgroundSize: '28px 28px',
    // backgroundColor: '#fafafa',
    // backgroundImage: 'radial-gradient(circle, #D7D7D7, #D7D7D7 1px, #FFF 1px, #FFF)',
    backgroundImage: 'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)'
  },
  login: {
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  title: {
    marginBottom: 48
  },
  form: {
    boxShadow: '0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07)',
    borderRadius: '4px',
    margin: '0 auto',
    // padding: 40,
    backgroundColor: '#fff',
    minWidth: 400,
    minHeight: 340,
    // height: 240,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  formContent: {
    padding: 40
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  background: {
    backgroundColor: '#f5f7f9',
    backgroundImage: 'radial-gradient(circle, #D7D7D7, #D7D7D7 1px, #FFF 1px, #FFF)',
    height: '100vh',
    backgroundSize: '28px 28px'
  },
  column: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  fields: {
    flexBasis: '55%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 40
  }
}
