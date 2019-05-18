import PropTypes from 'prop-types'

export const AddressPropType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  street: PropTypes.string,
  apt: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
  postalCode: PropTypes.string,
  country: PropTypes.string,
  kind: PropTypes.string
})

export const UploadPropType = PropTypes.shape({
  id: PropTypes.string,
  pages: PropTypes.number,
  name: PropTypes.string,
  type: PropTypes.string,
  file: PropTypes.string,
  status: PropTypes.string,
  thumbnail: PropTypes.string,
  orders: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string }))
})

export const ContactPropType = PropTypes.shape({
  id: PropTypes.string,
  address: AddressPropType
})

export const OptionPropType = PropTypes.shape({
  id: PropTypes.string,
  doubleSided: PropTypes.bool,
  color: PropTypes.bool,
  perforatedPage: PropTypes.bool,
  extraService: PropTypes.bool,
  returnEnvelope: PropTypes.bool,
  mailType: PropTypes.string
})

export const LetterPropType = PropTypes.shape({
  id: PropTypes.string,
  createdAt: PropTypes.string,
  expectedDeliveryDate: PropTypes.string,
  trackingNumber: PropTypes.string,
  carrier: PropTypes.string,
  mailType: PropTypes.string,
  status: PropTypes.string,
  sendDate: PropTypes.string
})

export const OrderPropType = PropTypes.shape({
  id: PropTypes.string,
  updatedAt: PropTypes.string,
  paid: PropTypes.bool,
  contact: ContactPropType,
  upload: UploadPropType,
  options: OptionPropType,
  charge: PropTypes.shape({
    id: PropTypes.string,
    amount: PropTypes.number
  })
})

export const CardPropType = PropTypes.shape({
  brand: PropTypes.string,
  cvcCheck: PropTypes.string,
  id: PropTypes.string,
  last4: PropTypes.string,
  stripeCustomerId: PropTypes.string
})

export const UserPropType = PropTypes.shape({
  id: PropTypes.string,
  role: PropTypes.string,
  emailAddress: PropTypes.string,
  cards: PropTypes.arrayOf(CardPropType)
})

