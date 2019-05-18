import React from 'react'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  root: {
    // backgroundColor: '#24292e',
    backgroundImage: 'linear-gradient(to bottom, #121212 0%, #323232 100%)',
    color: 'rgba(255,255,255,.7)'
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '30px'
  },
  inner: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: '0 auto'
  },
  link: {
    color: 'rgba(255,255,255,.7)',
    textDecoration: 'none'
  },
  listItem: {
    listStyleType: 'none',
    marginBottom: '0.6em'
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    margin: 0,
    minWidth: '160px'
  }
}

const left = [
  { text: 'Login', link: '/login' },
  { text: 'Order', link: '/order' },
  { text: 'Account', link: '/account' }
]

const right = [
  { text: 'Terms and Conditions', link: '/terms' },
  { text: 'Privacy Policy', link: '/privacy-policy' },
  { text: 'Cookie Policy', link: '/cookie-policy' },
  { text: 'Disclaimer', link: '/disclaimer' }
]

class Footer extends React.Component {
  render () {
    const { classes } = this.props
    return (
      <footer className={classes.root}>
        <div className={classes.footer}>
          <div className={classes.inner}>
            <ul className={classes.column}>
              {left.map(item =>
                (<li
                  className={classes.listItem}
                  key={`li_${item.link}`}
                >
                  <a
                    key={`link_${item.link}`}
                    href={item.link}
                    className={classes.link}
                  >
                    {item.text}
                  </a>
                </li>)
              )}
            </ul>
            <ul className={classes.column}>
              {right.map(item =>
                (<li
                  className={classes.listItem}
                  key={`li_${item.link}`}
                >
                  <a
                    key={`link_${item.link}`}
                    href={item.link}
                    className={classes.link}
                  >
                    {item.text}
                  </a>
                </li>)
              )}
            </ul>
          </div>
          <div />
        </div>
      </footer>
    )
  }
}

export default withStyles(styles)(Footer)
