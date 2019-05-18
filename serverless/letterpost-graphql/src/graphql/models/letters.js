const AWS = require('aws-sdk')
const path = require('path')
const db = require('dynamodb-tools')
const Orders = require('./orders')
const Contacts = require('./contacts')
const Addresses = require('./addresses')
const Options = require('./options')
const Uploads = require('./uploads')
const Users = require('./users')
const { sendOrderConfirmationEmail } = require('../email')

const {
  LOB_TEST_API_KEY,
  LOB_PRODUCTION_API_KEY,
  SES_TOPIC_ARN
} = process.env

const Lob = require('lob')(LOB_PRODUCTION_API_KEY)

const LETTERS_TABLE = `${process.env.DYNAMODB_PREFIX}-letters`

const createLobLetter = (letter) => {
  return new Promise((resolve, reject) => {
    Lob.letters.create({
      ...letter,
      address_placement: 'insert_blank_page'
    }, (err, resp) => {
      if (err) {
        console.error(err)
        reject(err)
      }
      resolve(resp)
    })
  })
}

const SENDER = {
  name: 'Ben Gardner',
  company: 'Letterpost',
  street: '1150 Ripley St',
  city: 'Silver Spring',
  state: 'MD',
  postalCode: '20910',
  country: 'US'
}

const mapAddressFields = recipient => ({
  name: recipient.name,
  address_line1: recipient.street,
  address_line2: recipient.apt,
  address_city: recipient.city,
  address_state: recipient.state,
  address_zip: recipient.postalCode,
  address_country: recipient.country
})

async function create ({ orderId, user: userId }) {
  const user = await Users.get({ id: userId })
  const sender = user.returnAddress
    ? await Addresses.get({ id: user.returnAddress })
    : SENDER

  const order = await Orders.get({ id: orderId })
  const contact = await Contacts.get({ id: order.contact })
  const address = await Addresses.get({ id: contact.address })
  const options = await Options.get({ id: order.options })
  const upload = await Uploads.get({ id: order.upload })
  const {
    color,
    doubleSided,
    perforatedPage,
    returnEnvelope,
    mailType 
  } = options
  let { extraService } = options
  extraService = extraService === 'none' ? null : extraService
  const result = await createLobLetter({
    to: mapAddressFields(address),
    from: mapAddressFields(sender),
    file: upload.file,
    color: color,
    double_sided: doubleSided,
    perforated_page: perforatedPage,
    return_envelope: returnEnvelope,
    mail_type: mailType,
    extra_service: extraService
  }).catch(err => {
    throw err
  })
  await Orders.update({ id: orderId, letter: result.id })
  await Orders.create({ user: userId })

  await sendOrderConfirmationEmail(user)
  return db(LETTERS_TABLE)
    .set({
      id: result.id,
      carrier: result.carrier,
      expectedDeliveryDate: result.expected_delivery_date,
      mailType: result.mail_type,
      trackingNumber: result.tracking_number,
      sendDate: result.send_date,
      order: orderId,
      user: address.user,
      status: 'received',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
}

const get = args => db(LETTERS_TABLE)
  .get(args)

const remove = (input) => db(LETTERS_TABLE)
  .remove({ id: input.id })
  .then(() => input)

const update = (input) => db(LETTERS_TABLE)
  .set({
    updatedAt: new Date().toISOString(),
    ...input
  })

module.exports.create = create
module.exports.update = update
module.exports.get = get
module.exports.remove = remove
module.exports.TABLE = LETTERS_TABLE
