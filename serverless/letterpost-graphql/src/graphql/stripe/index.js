const stripe = require('stripe')(process.env.STRIPE_PRODUCTION_API_KEY)

function charge ({ stripeCustomerId, amount }) {
  return stripe.charges.create({
    amount,
    currency: 'usd',
    customer: stripeCustomerId
  })
}

async function createSource ({ stripeEmail, stripeTokenId }) {
  let customer
  try {
    customer = await stripe.customers.create({
      email: stripeEmail
    })
  } catch (err) {
    console.error(err)
    throw err
  }

  let source
  try {
    source = await stripe.customers.createSource(customer.id, {
      source: stripeTokenId
    })
  } catch (err) {
    console.error(err)
    throw err
  }
  return source
}

module.exports.createSource = createSource
module.exports.charge = charge
