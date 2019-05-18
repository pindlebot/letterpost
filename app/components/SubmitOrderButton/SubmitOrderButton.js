import React from 'react'

import Button from '@material-ui/core/Button'
import { Mutation } from 'react-apollo'
import { CREATE_CHARGE, CREATE_LETTER } from '../../graphql/mutations'

class SubmitOrderButton extends React.Component {
  render () {
    return (
      <Mutation mutation={CREATE_CHARGE}>
        {(createCharge, { loading: chargeLoading }) => {
          return (
            <Mutation mutation={CREATE_LETTER}>
              {(createLetter, { loading: letterLoading }) => {
                return (
                  <Button />
                )
              }}
            </Mutation>
          )
        }}
      </Mutation>
    )
  }
}

export default SubmitOrderButton
