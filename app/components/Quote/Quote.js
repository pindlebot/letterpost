import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const CALCULATE_FEE = gql`
  query($input: PriceInput!) {
    calculateFee (input: $input)
  }
`

const Quote = ({ classes, currentOrder }) => {
  if (!currentOrder) return false
  let { upload, options } = currentOrder
  let { __typename, id, ...rest } = options
  let pages = (upload && upload.pages) || null
  return (
    <Query
      skip={!pages}
      query={CALCULATE_FEE}
      variables={{
        input: {
          ...rest,
          pages: pages
        }
      }}
    >
      {query => {
        if (query.loading) return false
        let fee = query?.data?.calculateFee
        if (fee) fee = (fee / 100).toFixed(2)
        return (
          <div style={{
            flexBasis: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div>{fee ? 'Order Total ' + fee : ''}</div>
          </div>
        )
      }}
    </Query>
  )
}

export default Quote
