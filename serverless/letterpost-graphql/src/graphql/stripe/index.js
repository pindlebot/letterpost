const stripe = require('stripe')(process.env.STRIPE_PRODUCTION_API_KEY)

function charge ({ stripeCustomerId, amount }) {
  return stripe.charges.create({
    amount,
    currency: 'usd',
    customer: stripeCustomerId
  })
}

async function createSource ({ stripeEmail, stripeTokenId }) {
  const customer = await stripe.customers.create({
    email: stripeEmail
  })
  const source = await stripe.customers.createSource(customer.id, {
    source: stripeTokenId
  })

  return source
}

module.exports.createSource = createSource
module.exports.charge = charge
