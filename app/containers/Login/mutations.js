import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

module.exports = [
  graphql(
    gql`
      mutation(
        $emailAddress: String!
        $password: String!
      ) {
        signinUser(
          emailAddress: $emailAddress
          password: $password
        ) {
          token
        }
      }
    `,
    {
      name: 'signinWithEmail',
      props: ({
        signinWithEmail,
        ownProps: { client }
      }) => ({
        signin: async (variables) => {
          const resp = await signinWithEmail({ variables })
          const { data: { signinUser: { token } } } = resp

          if (token) {
            window.localStorage.setItem('token', token)

            await client.resetStore()
          }

          return resp
        }
      })
    }
  ),
  graphql(
    gql`
      mutation(
        $emailAddress: String!
        $password: String!
      ) {
        createUser(
          emailAddress: $emailAddress,
          password: $password
        ) {
          id
        }
        signinUser(
          emailAddress: $emailAddress
          password: $password
        ) {
          token
        }
      }
    `,
    {
      name: 'createWithEmail',
      props: ({
        createWithEmail,
        ownProps: { client }
      }) => ({
        create: async (variables) => {
          const resp = await createWithEmail({ variables })
          const { data: { signinUser: { token } } } = resp

          if (token) {
            window.localStorage.setItem('token', token)

            await client.resetStore()
          }

          return resp
        }
      })
    }
  )
]
