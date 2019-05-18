import React from 'react'
import PropTypes from 'prop-types'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import IconButton from '@material-ui/core/IconButton'
import ProfileAvatar from '../ProfileAvatar'
import { withStyles } from '@material-ui/core'

const styles = {
  menu: {
    width: '300'
  },
  item: {
    padding: '16px',
    boxShadow: 'none',
    backgroundColor: '#fff'
  },
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
}

class AppBarMenu extends React.Component {
  state = {
    open: false,
    anchorEl: undefined
  }

  handleClick = (event) => {
    this.setState({ open: true, anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ open: false, anchorEl: undefined })
  }

  renderMenu = () => {
    const { classes } = this.props
    return [
      this.props.logged
        ? (
          <MenuItem
            className={classes.item}
            onClick={this.props.signout}
            key={0}
          >
            Logout
          </MenuItem>
        ) : (
          <MenuItem
            className={classes.item}
            onClick={this.props.login}
            key={1}>Login</MenuItem>
        ),
      <MenuItem
        className={classes.item}
        onClick={this.props.order}
        key={3}
      >
        Order
      </MenuItem>,
      <MenuItem
        className={classes.item}
        onClick={this.props.account}
        key={4}
      >
        Account
      </MenuItem>
    ]
  }

  render () {
    const { open } = this.state
    const { landing, classes } = this.props

    return (
      <div className={classes.root}>
        <ProfileAvatar />
        <IconButton
          aria-owns={this.state.open ? 'simple-menu' : null}
          aria-haspopup='true'
          onClick={this.handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id='simple-menu'
          open={open}
          onClose={this.handleClose}
          anchorEl={this.state.anchorEl}
          className={classes.menu}
          PaperProps={{
            classes: {
              root: classes.menu
            }
          }}
        >
          {this.renderMenu()}
        </Menu>
      </div>
    )
  }
}

AppBarMenu.propTypes = {
  data: PropTypes.object,
  logged: PropTypes.bool,
  landing: PropTypes.bool
}

AppBarMenu.defaultProps = {
  logged: false,
  landing: false
}

export default withStyles(styles)(AppBarMenu)
