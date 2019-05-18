import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import FilterListIcon from '@material-ui/icons/FilterList'
import { lighten } from '@material-ui/core/styles/colorManipulator'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { MESSAGES_QUERY } from '../../graphql/queries'
import AddBoxIcon from '@material-ui/icons/AddBox'

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85)
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark
      },
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    color: theme.palette.text.secondary,
    display: 'flex',
    flexDirection: 'row'
  },
  title: {
    flex: '0 0 auto'
  }
})

class DashboardMessagesTableToolbar extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired
  }

  handleDelete = async () => {
    const { selected, client } = this.props
    let promises = Promise.all(
      selected.map(id => this.props.deleteMessage({
        variables: { id },
        optimisticResponse: {
          __typename: 'Mutation',
          deleteMessage: {
            __typename: 'Message',
            id: id
          }
        }
      }))
    )

    await promises
  }

  render () {
    const { numSelected, selected, classes } = this.props
    console.log({ selected })
    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color='inherit' variant='body2'>
              {numSelected} selected
            </Typography>
          ) : (
            <Typography variant='body2' id='tableTitle'>
              Inbox
            </Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          <IconButton onClick={this.props.handleReplyClick}>
            <AddBoxIcon />
          </IconButton>
          {numSelected > 0 ? (
            <Tooltip title='Delete'>
              <IconButton aria-label='Delete' onClick={this.handleDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title='Filter list'>
              <IconButton aria-label='Filter list'>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </Toolbar>
    )
  }
}

export default withStyles(toolbarStyles)(DashboardMessagesTableToolbar)
