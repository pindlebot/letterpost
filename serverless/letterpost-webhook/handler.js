const {
  AWS_REGION,
  DYNAMODB_TABLE,
  LOB_TEST_USER_ID
} = process.env

const db = require('dynamodb-tools')
const LETTERS_TABLE = `${DYNAMODB_TABLE}-letters`
const EVENTS_TABLE = `${DYNAMODB_TABLE}-events`

module.exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const {
    expected_delivery_date,
    send_date,
    tracking_events,
    tracking_number
  } = data.body
  if (tracking_events.length) {
    const letter = await db(LETTERS_TABLE).get({ id: data.body.id })
      .catch(console.error.bind(console))
    if (letter) {
      await db(LETTERS_TABLE).set({
        id: data.body.id,
        trackingNumber: tracking_number,
        sendDate: send_date,
        expectedDeliveryDate: expected_delivery_date
      })
    }
    await Promise.all(
      tracking_events.map(event => (
        db(EVENTS_TABLE).set({
          id: event.id,
          letter: data.body.id,
          user: (letter && letter.user) || LOB_TEST_USER_ID,
          eventType: data.event_type.id,
          name: event.name,
          location: event.location,
          time: event.time,
          createdAt: event.date_created,
          updatedAt: event.date_modified
        })
      ))
    )
  }

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({})
  })
}
