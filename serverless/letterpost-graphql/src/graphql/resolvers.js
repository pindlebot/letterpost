const Users = require('./models/users')
const Uploads = require('./models/uploads')
const Contacts = require('./models/contacts')
const Orders = require('./models/orders')
const Cards = require('./models/cards')
const Charges = require('./models/charges')
const Letters = require('./models/letters')
const Addresses = require('./models/addresses')
const Options = require('./models/options')
const Events = require('./models/events')
const db = require('dynamodb-tools')
const GraphQLJSON = require('graphql-type-json')
const GraphQLAny = require('./types/GraphQLAny')
const { calculateFee } = require('./util')
const { sendEmail } = require('./email')
const MESSAGES_TABLE = `${process.env.DYNAMODB_PREFIX}-messages`
const { ValidationError } = require('apollo-server-lambda')

const message = {
  get: ({ id }) => {
    return db(MESSAGES_TABLE).get({ id })
  },
  list: () => {
    return db(MESSAGES_TABLE).get()
  },
  remove: ({ id }) => {
    return db(MESSAGES_TABLE).remove({ id })
  }
}

const rootQuery = (table, context) => {
  return db(`${process.env.DYNAMODB_PREFIX}-${table}`)
    .get({ user: context.user })
}

const priceQuery = async (_, { input }, context) => {
  let {
    pages,
    doubleSided = false,
    color = true,
    perforatedPage = null,
    returnEnvelope = false,
    extraService = 'none',
    mailType = 'usps_standard'
  } = input
  let amount = calculateFee(pages, {
    doubleSided,
    color,
    perforatedPage,
    returnEnvelope,
    extraService,
    mailType
  })
  return amount
}

const resolvers = {
  Query: {
    message: (_, args, { user }) => {
      return message.get(args)
    },
    messages: (_, args, ctx) => {
      return message.list()
    },
    calculateFee: priceQuery,
    currentOrder: (_, args, { user }) => Orders.getCurrentOrder({ user, ...args }),
    user: (obj, args, { user }) => Users.get({ id: user })
      .then(data => data && Object.keys(data).length
        ? data
        : Users.createSession({ user })
      ),
    letter: (_, args) => Letters.get(args),
    card: (_, args) => Cards.get(args),
    charge: (_, args) => Charges.get(args),
    contact: (_, args) => Contacts.get(args),
    order: (_, args) => Orders.get(args),
    upload: (_, args) => Uploads.get(args),
    address: (_, args) => Addresses.get(args),
    options: (_, args) => Options.get(args),
    event: (_, args) => Events.get(args),
    uploads: (_, args, ctx) => Uploads.get({ user: ctx.user }),
    orders: (_, args, ctx) => rootQuery('orders', ctx),
    cards: (_, args, ctx) => rootQuery('cards', ctx),
    letters: (_, args, ctx) => rootQuery('letters', ctx),
    events: (_, args, ctx) => rootQuery('events', ctx),
    contacts: (_, args, ctx) => rootQuery('contacts', ctx),
    charges: (_, args, ctx) => rootQuery('charges', ctx),
    addresses: (_, args, ctx) => rootQuery('addresses', ctx)
  },
  Mutation: {
    sendMessage: (_, { input }, { user }) => {
      return sendEmail({ ...input })
    },
    deleteMessage: async (_, args, { user }) => {
      let data = await message.remove(args)
      console.log({ data })
      return data
    },
    updatePassword: (_, { password }, { user }) => Users.updatePassword({ user, password }),
    createPresignedPost: (_, { key }, { user }) => Uploads.createPresignedPost({ user, key }),
    resetPassword: (_, { emailAddress }, { user }) => Users.resetPassword({ user, emailAddress }),
    emailInUse: (_, { emailAddress }, { user }) => Users.emailInUse({ user, emailAddress }),
    createCharge: (_, { orderId }, { user }) => Charges.create({ orderId, user }),
    createUser: (_, { emailAddress, password }, { user }) =>
      Users.create({ emailAddress, password, id: user }),
    createUpload: (_, { size, name, type, orderId }, { user }) =>
      Uploads.create({ size, name, type, orderId, user }),
    createContact: (_, data, { user }) => Contacts.create({ user }),
    createLetter: (_, { orderId }, { user }) => Letters.create({ orderId, user }),
    createCard: (_, { input }) => Cards.create(input),
    createEvent: (_, data) => Events.create(data),
    signinUser: (_, { emailAddress, password }) =>
      Users.signin({ emailAddress, password }),
    updateAddress: (_, { input }) => Addresses.update(input),
    updateOptions: (_, { input }, { user }) => Options.update({ ...input, user }),
    updateEvent: (_, data) => Events.update(data),
    updateUser: (_, { input }) => Users.update(input),
    updateCard: (_, { input }) => Cards.update(input),
    updateContact: (_, { input }) => Contacts.update(input),
    updateUpload: (_, { input }) => Uploads.update(input),
    updateOrder: (_, { input }) => Orders.update(input),
    deleteUpload: (_, { id }, { user }) => Uploads.remove({ id }),
    deleteContact: (_, { id }) => Contacts.remove({ id }),
    deleteUser: (_, { id }) => Users.remove({ id }),
    deleteOrder: (_, { id }) => Orders.remove({ id }),
    deleteCard: (_, { id }, { user }) => Cards.remove({ id, user }),
    updatePrimaryCard: (obj, { primaryCard }, { user }) => {
      return Users.update({
        primaryCard: primaryCard,
        id: user,
        updatedAt: new Date().toISOString()
      })
    }
  },
  User: {
    uploads: (user) => Uploads.get({ user: user.id }),
    orders: (user) => Orders.get({ user: user.id }),
    contacts: (user) => Contacts.get({ user: user.id }),
    cards: (user) => Cards.get({ user: user.id }),
    charges: (user) => Charges.get({ user: user.id }),
    letters: (user) => Letters.get({ user: user.id }),
    addresses: (user) => Addresses.get({ user: user.id }),
    events: (user) => Events.get({ user: user.id }),
    primaryCard: (user) => user.primaryCard
      ? Cards.get({ id: user.primaryCard })
      : null,
    returnAddress: (user) => Addresses.get({ id: user.returnAddress }),
    currentOrder: (user) => Orders.getCurrentOrder({ user: user.id })
  },
  Card: {
    user: (card) => Users.get({ id: card.user }),
    charges: (card, _, { user }) => Charges.get({ card: card.id })
  },
  Contact: {
    user: (contact, _, { user }) => Users.get({ id: contact.user }),
    orders: (contact, _, { user }) => Orders.get({ contact: contact.id }),
    address: (contact, _, { user }) => Addresses.get({ id: contact.address })
  },
  Order: {
    upload: (order, _, { user }) => Uploads.get({ id: order.upload }),
    user: (order, _, { user }) => Users.get({ id: order.user }),
    contact: (order, _, { user }) => Contacts.get({ id: order.contact }),
    charge: (order, _, { user }) => Charges.get({ id: order.charge }),
    letter: (order, _, { user }) => Letters.get({ id: order.letter }),
    options: (order, _, { user }) => Options.get({ id: order.options })
  },
  Upload: {
    user: (upload) => Users.get({ id: upload.user }),
    orders: ({ id }, _, { user }) => {
      return Orders.get({ upload: id })
    }
  },
  Charge: {
    user: (charge) => Users.get({ id: charge.user }),
    order: (charge) => Orders.get({ id: charge.order }),
    card: (charge) => Cards.get({ id: charge.card })
  },
  Letter: {
    user: (letter) => Users.get({ id: letter.user }),
    order: (letter) => Orders.get({ id: letter.order }),
    events: (letter) => Events.get({ letter: letter.id })
  },
  Address: {
    user: (address) => Users.get({ id: address.user }),
    contact: (address) => Contacts.get({ id: address.contact })
  },
  Event: {
    user: (event) => Users.get({ id: event.user }),
    letter: (event) => Letters.get({ id: event.letter })
  },
  Options: {
    order: (options) => Orders.get({ id: options.order })
  },
  JSON: GraphQLJSON,
  Any: GraphQLAny,
  ExtraService: {
    CERTIFIED: 'certified',
    REGISTERED: 'registered',
    NONE: 'none'
  },
  MailType: {
    USPS_FIRST_CLASS: 'usps_first_class',
    USPS_STANDARD: 'usps_standard'
  }
}

module.exports = resolvers
