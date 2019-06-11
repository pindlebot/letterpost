import React from 'react'
import Layout from 'antd/lib/layout'
import classes from './styles.scss'

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
    return (
      <Layout.Footer className={classes.root}>
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
      </Layout.Footer>
    )
  }
}

export default Footer
