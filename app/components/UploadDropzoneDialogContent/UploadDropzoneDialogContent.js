import React from 'react'
import PropTypes from 'prop-types'
import UploadDropzone from '../UploadDropzone'
import UploadList from '../UploadList'
import Radio from 'antd/lib/radio'
import styles from './styles'

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
    this.setState({ alignment: event.target.value })
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
        <div
          className={classes.dialogContent}
        >
          <div className={classes.dialogContentRow}>
            <div className={classes.dialogContentColumn}>
              <UploadList
                order={this.props.order}
                uploads={this.props.uploads}
                client={this.props.client}
              />
              <div className={styles.spacer} />
              <Radio.Group
                value={this.state.alignment}
                onChange={this.handleAlignment}
                className={classes.toggleButtonGroup}
                buttonStyle="solid"
              >
                <Radio.Button value={'upload'} className={classes.toggleButton}>
                  <span>Upload</span>
                </Radio.Button>
                <Radio.Button value={'preview'} className={classes.toggleButton}>
                  <span>Preview</span>
                </Radio.Button>
              </Radio.Group>
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
        </div>
      </React.Fragment>
    )
  }
}

export default UploadDropzoneDialogContent
