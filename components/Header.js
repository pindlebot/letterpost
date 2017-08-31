/* eslint-disable react/no-danger */
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
//import Session from '../session'
//import Sidebar from './Sidebar'
//import AppBarMenu from './AppBarMenu'
//import SearchInput from './SearchInput'

const styleSheet = {
  header99: {
    width: '100%',
    color: '#ffffff',
    backgroundImage: 'linear-gradient(-90deg, #7873F5 0%, #EC77AB 100%)'
  },
  title: {
    flex: '1',
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '0.5px'
  },
  link: {
    fontSize: '15px',
    color: '#ffffff'
  },
}

class Header extends React.Component {
  constructor(props) {
    super(props)


  }

  render() {
    var {classes} = this.props;
    return (
      <header>
        <AppBar position="static" className={classes.header99}>
          <Toolbar>
            
            <Typography type="title" color="inherit" className={classes.title}>
              <a href="/" className={classes.link}>AutomationFuel</a>
            </Typography>
            
          </Toolbar>
        </AppBar>
      </header>
    )
  }
}

export default withStyles(styleSheet)(Header)