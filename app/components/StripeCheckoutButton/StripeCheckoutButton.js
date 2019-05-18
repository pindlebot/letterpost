import React from 'react'
import PropTypes from 'prop-types'
import StripeCheckout from '../StripeCheckout'
import { PUBLIC_STRIPE_API_KEY } from '../../lib/config'
import { USER_QUERY } from '../../graphql/queries'
import { CREATE_CARD } from '../../graphql/mutations'
import { Mutation } from 'react-apollo'
import Button from '@material-ui/core/Button'

class StripeCheckoutButton extends React.Component {
  createCard = ({ mutate }) => variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      createCard: {
        __typename: 'Card',
        ...variables.input,
        last4: 'xxxx',
        stripeCustomerId: '123',
        cvcCheck: 'pass',
        brand: 'loading',
        id: '123'
      }
    },
    update: (store, { data: { createCard } }) => {
      let { user } = store.readQuery({ query: USER_QUERY })
      user.cards.push(createCard)
      store.writeQuery({
        query: USER_QUERY,
        data: {
          user: {
            ...user,
            primaryCard: createCard
          }
        }
      })
    }
  })

  onToken = mutate => async (token) => {
    const {
      user: {
        data: {
          user
        }
      }
    } = this.props

    this.createCard({ mutate })({
      input: {
        user: user.id,
        stripeTokenId: token.id,
        stripeEmail: token.email
      }
    })
  }

  render () {
    const {
      user: {
        data: {
          user
        }
      }
    } = this.props

    return (
      <Mutation mutation={CREATE_CARD}>
        {(mutate, { error, data }) => {
          return (
            <StripeCheckout
              token={this.onToken(mutate)}
              apiKey={PUBLIC_STRIPE_API_KEY}
            >
              <Button onClick={() => {}}>
                Add Payment Method
              </Button>
            </StripeCheckout>
          )
        }}
      </Mutation>
    )
  }
}

export default StripeCheckoutButton
