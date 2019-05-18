import gql from 'graphql-tag'

export const CREATE_ORDER = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
    }
  }
`

export const UPDATE_ORDER = gql`
  mutation updateOrder($input: UpdateOrderInput!) {
    updateOrder(input: $input) {
      id
      updatedAt
      paid
      contact {
        id
        address {
          id
          name
          street
          apt
          city
          state
          postalCode
          country
          kind
        }
      }
      upload {
        id
        pages
        name
        size
        type
        file
        status
        thumbnail
        orders {
          id
        }
      }
      options {
        id
        doubleSided
        color
        perforatedPage
        returnEnvelope
        extraService
        mailType
      }
      charge {
        id
        amount
      }
      letter {
        id
        createdAt
        expectedDeliveryDate
        trackingNumber
        carrier
        mailType
        status
        sendDate
      }
    }
  }
`

export const CREATE_UPLOAD = gql`
  mutation(
    $orderId: ID!
    $name: String!
    $size: Int
    $type: String
  ) {
    createUpload(
      orderId: $orderId
      name: $name
      size: $size
      type: $type
    ) {
      id
      pages
      name
      size
      type
      file
      status
      thumbnail
      orders {
        id
      }
    }
  }
`

export const UPDATE_UPLOAD = gql`
  mutation ($input: UpdateUploadInput!) {
    updateUpload(input: $input) {
      pages
      id
      name
      size
      type
      file
      status
      thumbnail
      orders { 
        id
      }
    }
  }
`

export const CREATE_CONTACT = gql`
  mutation {
    createContact {
      id
      address {
        id
        name
        street
        apt
        city
        state
        postalCode
        country
        kind
      }
      orders {
        id
      }
    }
  }
`

export const UPDATE_CONTACT = gql`
  mutation ($input: UpdateContactInput!) {
    updateContact(input: $input) {
      id
      orders {
        id
      }
    }
  }
`

export const UPDATE_ADDRESS = gql`
  mutation ($input: UpdateAddressInput!) {
    updateAddress(input: $input) {
      id
      name
      street
      apt
      city
      state
      postalCode
      country
      kind
    }
  }
`

export const DELETE_UPLOAD = gql`
  mutation ($id: ID!) {
    deleteUpload(
      id: $id
    ) {
      id
    }
  }
`

export const DELETE_CONTACT = gql`
  mutation ($id: ID!) {
    deleteContact(id: $id) {
      id
    }
  }
`

export const UPDATE_CARD = gql`
  mutation ($input: UpdateCardInput!) {
    updateCard(input: $input) {
      brand
      cvcCheck
      id
      last4
      stripeCustomerId
    }
  }
`

export const CREATE_CHARGE = gql`
  mutation($orderId: ID!) {
    createCharge(orderId: $orderId) {
      id
      amount
      order {
        id
      }
    }
  }
`

export const UPDATE_OPTIONS = gql`
  mutation ($input: UpdateOptionsInput!) {
    updateOptions(input: $input) {
      id
      doubleSided
      color
      perforatedPage
      returnEnvelope
      mailType
      extraService
    }
  }
`

export const UPDATE_USER = gql`
  mutation ($input: UpdateUserInput!) {
    updateUser(input: $input) {
      emailAddress
      id
    }
  }
`

export const UPDATE_UPLOAD_STATUS = gql`
  mutation ($input: UpdateUploadInput!) {
    updateUpload(input: $input) {
      id
      status
    }
  } 
`

export const CREATE_LETTER = gql`
  mutation ($orderId: ID!) {
    createLetter(orderId: $orderId) {
      id
      expectedDeliveryDate
      trackingNumber
      carrier
      mailType
      status
      sendDate
      createdAt
      order {
        id
      }
    }
  }
`

export const CREATE_CARD = gql`
  mutation ($input: CreateCardInput!) {
    createCard(input: $input) {
      brand
      cvcCheck
      id
      last4
      stripeCustomerId
    }
  }
`

export const DELETE_CARD = gql`
  mutation ($id: ID!) {
    deleteCard(id: $id) {
      id
    }
  }
`

export const UPDATE_PRIMARY_CARD = gql`
  mutation ($primaryCard: ID!) {
    updatePrimaryCard(primaryCard: $primaryCard) {
      id
      primaryCard {
        brand
        cvcCheck
        id
        last4
        stripeCustomerId
      }
    }
  }
`

export const EMAIL_IN_USE = gql`
  mutation($emailAddress: String!) {
    emailInUse(emailAddress: $emailAddress)
  }
`

export const RESET_PASSWORD = gql`
  mutation($emailAddress: String!) {
    resetPassword(emailAddress: $emailAddress)
  }
`
export const DELETE_USER = gql`
  mutation($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`

export const DELETE_MESSAGE = gql`
  mutation($id: ID!) {
    deleteMessage(id: $id) {
      id
    }
  }
`
