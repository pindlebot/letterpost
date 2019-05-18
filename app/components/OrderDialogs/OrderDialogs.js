import React from 'react'
import PropTypes from 'prop-types'
import PdfEmbedDialog from '../PdfEmbedDialog'
import RecipientFormDialog from '../RecipientFormDialog'
import UploadDropzoneDialog from '../UploadDropzoneDialog'
import StripeCheckoutDialog from '../StripeCheckoutDialog'

const OrderDialogs = props => (
  <React.Fragment>
    <PdfEmbedDialog
      open={props.open === 'pdf'}
      handleClose={props.handleDialogClose}
      order={props.order}
      submitOrder={props.submitOrder}
    />
    <RecipientFormDialog
      open={props.open === 'addressbook'}
      client={props.client}
      order={props.order}
      user={props.user}
      handleClose={props.handleDialogClose}
      updateOrder={props.updateOrder}
    />
    <UploadDropzoneDialog
      open={props.open === 'dropzone'}
      handleClose={props.handleDialogClose}
      updateOrder={props.updateOrder}
      order={props.order}
      client={props.client}
    />
    <StripeCheckoutDialog
      handleClose={props.handleDialogClose}
      open={props.open === 'stripe'}
      client={props.client}
      user={props.user}
    />
  </React.Fragment>
)

OrderDialogs.defaultProps = {
  user: {},
  order: {}
}

OrderDialogs.propTypes = {
  open: PropTypes.string,
  handleDialogClose: PropTypes.func.isRequired,
  updateOrder: PropTypes.func.isRequired,
  submitOrder: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired
}

export default OrderDialogs
