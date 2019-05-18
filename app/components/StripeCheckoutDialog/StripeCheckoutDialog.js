import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import PropTypes from 'prop-types'
import StripeCheckout from '../StripeCheckout'
import { USER_QUERY } from '../../graphql/queries'
import { CREATE_CARD } from '../../graphql/mutations'
import { Mutation } from 'react-apollo'

class StripeCheckoutDialog extends React.Component {
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
    this.props.handleClose()
      .then(() => {
        this.createCard({ mutate })({
          input: {
            user: user.id,
            stripeTokenId: token.id,
            stripeEmail: token.email
          }
        })
      })
  }

  render () {
    return (
      <Mutation mutation={CREATE_CARD}>
        {(mutate, { error, data }) => {
          return (
            <Dialog open={this.props.open} PaperProps={{
              style: {
                minWidth: '40vw',
                minHeight: '10vh'
              }
            }}>
              <StripeCheckout
                onToken={this.onToken(mutate)}
                handleClose={this.props.handleClose}
              />
            </Dialog>
          )
        }}
      </Mutation>
    )
  }
}

StripeCheckoutDialog.defaultProps = {
  open: false
}

export default StripeCheckoutDialog
