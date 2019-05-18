// @flow weak
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import { Mutation } from 'react-apollo'
import UploadListStatusButton from '../UploadListStatusButton'
import 'isomorphic-fetch'
import {
  DELETE_UPLOAD
} from '../../graphql/mutations'
import { UPLOADS_QUERY, ORDER_QUERY } from '../../graphql/queries'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'

const styles = theme => ({
  list: {
    [theme.breakpoints.up('sm')]: {
      height: 'calc(80vh - 68px - 53px - 24px - 42px)'
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: 24
    }
  },
  row: {

  }
})

function UploadListItemText ({ upload, color }) {
  return (
    <ListItemText
      key={`list_item_text_${upload.id}`}
      primary={<Typography color={color}>{upload.name}</Typography>}
      secondary={`${upload.size / 1e6}mb`}
    />
  )
}

const listItemStyles = {
  icon: {
    color: '#757575',
    '&:hover': {
      color: '#616161',
      backgroundColor: 'transparent'
    }
  },
  progress: {
    position: 'absolute',
    height: '10px',
    width: '100%',
    bottom: '8px',
    left: '0px'
  }
}

const formatFileSize = ({ size }) => {
  return size > 1e6
    ? `${Math.round(size / 1e6)} mb`
    : `${Math.round(size / 1e3)} kb`
}

const UploadListItem = withStyles(listItemStyles)(({
  upload,
  color,
  handleClick,
  isChecked,
  deleteUpload,
  classes
}) => {
  return (
    <ListItem dense button onClick={() => handleClick(upload)}>
      <Checkbox checked={isChecked(upload)} />
      <ListItemText
        primary={<Typography color={color}>{upload.name}</Typography>}
        secondary={formatFileSize(upload)}
      />
      <ListItemSecondaryAction>
        {upload.status === 'DONE' && (
          <IconButton
            aria-label='Delete'
            onClick={() => deleteUpload({ id: upload.id })}
            className={classes.icon}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </ListItemSecondaryAction>
      {upload.status !== 'DONE' && (
        <div className={classes.progress}>
          <LinearProgress />
        </div>
      )}
    </ListItem>
  )
})

class UploadList extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    order: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    uploads: PropTypes.object.isRequired
  }

  handleClick = (upload) => {
    const { order: { data: { currentOrder } } } = this.props
    return this.props.client.writeQuery({
      query: ORDER_QUERY,
      data: {
        currentOrder: {
          ...currentOrder,
          upload: (currentOrder.upload && currentOrder.upload.id) === upload.id
            ? null
            : upload
        }
      },
      variables: {
        id: currentOrder.id
      }
    })
  }

  isChecked = (upload) => {
    if (!upload) return false
    const { order: { data: { currentOrder } } } = this.props
    return upload.id === currentOrder?.upload?.id
  }

  deleteUpload = ({ mutate }) => variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      deleteUpload: {
        __typename: 'Upload',
        ...variables
      }
    },
    update: (store, { data: { deleteUpload } }) => {
      const data = store.readQuery({ query: UPLOADS_QUERY })
      const uploads = data.uploads
        .filter(upload => upload.id !== deleteUpload.id)
      store.writeQuery({ query: UPLOADS_QUERY, data: { ...data, uploads } })
    }
  })

  render () {
    const { classes, uploads } = this.props
    if (uploads.loading) return false
    const color = 'default'
    return (
      <Mutation mutation={DELETE_UPLOAD}>
        {(mutate) => {
          return (
            <List className={classes.list} disablePadding>
              {(uploads?.data?.uploads || []).map(upload =>
                <UploadListItem
                  key={upload.id}
                  upload={upload}
                  color={color}
                  handleClick={this.handleClick}
                  isChecked={this.isChecked}
                  deleteUpload={this.deleteUpload({ mutate })}
                />
              )}
            </List>
          )
        }}
      </Mutation>
    )
  }
}

export default withStyles(styles)(UploadList)
