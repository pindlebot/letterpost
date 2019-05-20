import React from 'react'
import PropTypes from 'prop-types'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import UploadDropzone from '../UploadDropzone'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import UploadList from '../UploadList'
import ImageIcon from '@material-ui/icons/Image'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

const thumbnailStyles = {
  height: 'calc(80vh - 53px - 68px)',
  objectFit: 'scale-down'
}

const Thumbnail = ({ currentOrder, uploads }) => {
  if (!currentOrder?.upload) {
    return false
  }
  const upload = uploads.data.uploads.find(upload => upload.id === currentOrder.upload.id)
  return (<img src={upload.thumbnail} style={thumbnailStyles} />)
}


class UploadDropzoneDialogContent extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    updateOrder: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    order: PropTypes.object
  }
  state = {
    alignment: 'upload'
  }

  handleAlignment = (event, alignment) => {
    this.setState({ alignment })
  }

  handleModalClose = () => {
    const { order: { data: { currentOrder } } } = this.props
    this.props.handleClose()
      .then(() => {
        this.props.updateOrder({
          input: {
            id: currentOrder.id,
            upload: (currentOrder?.upload?.id) || null
          }
        })
      })
  }

  render () {
    const {
      open,
      classes,
      order: {
        data: {
          currentOrder
        }
      }
    } = this.props
    const { alignment } = this.state
    return (
      <React.Fragment>
        <DialogTitle>Upload</DialogTitle>
        <DialogContent
          className={classes.dialogContent}
        >
          <div className={classes.dialogContentRow}>
            <div className={classes.dialogContentColumn}>
              <UploadList
                order={this.props.order}
                uploads={this.props.uploads}
                client={this.props.client}
              />
              <ToggleButtonGroup
                value={this.state.alignment}
                exclusive
                onChange={this.handleAlignment}
                className={classes.toggleButtonGroup}
              >
                <ToggleButton value={'upload'} className={classes.toggleButton}>
                  <CloudUploadIcon className={classes.icon} />
                  <span>Upload</span>
                </ToggleButton>
                <ToggleButton value={'preview'} className={classes.toggleButton}>
                  <ImageIcon className={classes.icon} />
                  <span>Preview</span>
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <div className={classes.dialogContentColumn}>
              {alignment === 'upload'
                ? <UploadDropzone
                  order={this.props.order}
                  client={this.props.client}
                  uploads={this.props.uploads}
                  handleClick={this.props.handleClick}
                />
                : <Thumbnail currentOrder={currentOrder} uploads={this.props.uploads} />}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleModalClose}>Done</Button>
        </DialogActions>
      </React.Fragment>
    )
  }
}

export default UploadDropzoneDialogContent
