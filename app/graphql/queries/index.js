import gql from 'graphql-tag'

export const CONTACTS_QUERY = gql`
  query {
    contacts {
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
  }
`

export const CONTACT_QUERY = gql`
  query ($id: ID!) {
    contact(id: $id) {
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
  }
`

export const ADDRESS_QUERY = gql`
  query ($id: ID!) {
    address(id: $id) {
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

export const ORDER_QUERY = gql`
  query ($id: ID) {
    currentOrder(id: $id) {
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
        extraService
        returnEnvelope
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

export const CHECKOUT_ORDER_QUERY = gql`
  query ($id: ID) {
    currentOrder(id: $id) {
      id
      updatedAt
      paid
      contact {
        id
        address {
          name
        }
      }
      upload {
        id
        name
        status
      }
      options {
        id
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

export const UPLOAD_QUERY = gql`
  query ($id: ID!) {
    upload(id: $id) {
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

export const UPLOADS_QUERY = gql`
  query {
    uploads {
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

export const USER_QUERY = gql`
  query {
    user {
      id
      role
      emailAddress
      cards {
        brand
        cvcCheck
        id
        last4
        stripeCustomerId
      }
      returnAddress {
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

export const ORDERS_QUERY = gql`
  query {
    orders {
      id
      updatedAt
      paid
      letter {
        id
        expectedDeliveryDate
        trackingNumber
        carrier
        mailType
        status
        sendDate
        createdAt
        events {
          id
          eventType
        }
      }
      options {
        id
        doubleSided
        color
        perforatedPage
        returnEnvelope
        mailType
        extraService
      }
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
      charge {
        id
        amount
      }
      upload {
        pages
        id
        name
        size
        type
        file
        status
        thumbnail
      }
    }
  }
`

export const CARDS_QUERY = gql`
  query {
    cards {
      brand
      cvcCheck
      id
      last4
      stripeCustomerId
    }
  }
`

export const MESSAGES_QUERY = gql`
  query {
    messages {
      id
      date
      from
      mail
      messageId
      notificationType
      receipt
      replyTo
      subject
      to
    }
  }
`

export const MESSAGE_QUERY = gql`
  query($id: ID!) {
    message(id: $id) {
      id
      date
      from
      headers
      html
      mail
      messageId
      notificationType
      receipt
      replyTo
      subject
      text
      textAsHtml
      to
    }
  }
`

export const ORDER_CONTACTS_QUERY = gql`
  query ($id: ID) {
    currentOrder(id: $id) {
      id
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
    }
  }
`

export const ORDER_OPTIONS_QUERY = gql`
  query ($id: ID) {
    currentOrder(id: $id) {
      id
      options {
        id
        doubleSided
        color
        perforatedPage
        extraService
        returnEnvelope
        mailType
      }
    }
  }
`
