import React, { Component } from 'react'
import { CardElement, injectStripe, Elements, StripeProvider } from 'react-stripe-elements'
import { PUBLIC_STRIPE_API_KEY } from '../../lib/config'
import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '18px',
      color: '#424770',
      letterSpacing: '0.025em',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#9e2146'
    }
  }
}

const CheckoutFormContent = ({ stripe, cancel, submit }) => (
  <React.Fragment>
    <DialogContent>
      {stripe
        ? <CardElement {...CARD_ELEMENT_OPTIONS} />
        : <div style={{height: 62, width: '100%'}} />
      }
    </DialogContent>
    <DialogActions>
      <Button onClick={cancel}>Cancel</Button>
      <Button onClick={submit} variant={'contained'} color={'primary'}>Submit</Button>
    </DialogActions>
  </React.Fragment>
)

const CheckoutForm = injectStripe(
  class extends React.Component {
    submit = async (evt) => {
      let { token } = await this.props.stripe.createToken()
      this.props.onToken(token)
    }

    cancel = (evt) => {
      this.props.handleClose(evt)
      evt.preventDefault()
      evt.stopPropagation()
    }

    render () {
      return (
        <CheckoutFormContent
          {...this.props}
          cancel={this.cancel}
          submit={this.submit}
        />
      )
    }
  }
)

class StripeCheckout extends Component {
  state = {
    stripe: undefined
  }

  componentDidMount () {
    const stripeJs = document.createElement('script')
    stripeJs.src = 'https://js.stripe.com/v3/'
    stripeJs.async = true
    stripeJs.onload = () => {
      setTimeout(() => {
        this.setState({
          stripe: window.Stripe(PUBLIC_STRIPE_API_KEY)
        })
      }, 500)
    }
    document.body && document.body.appendChild(stripeJs)
  }

  render () {
    if (!this.state.stripe) {
      return (
        <CheckoutFormContent cancel={() => {}} submit={() => {}} />
      )
    }
    return (
      <StripeProvider stripe={this.state.stripe}>
        <Elements>
          <CheckoutForm {...this.props} />
        </Elements>
      </StripeProvider>
    )
  }
}

export default StripeCheckout
