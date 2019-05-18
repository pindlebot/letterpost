const { GraphQLEnumType } = require('graphql')

const GraphQLExtraService = new GraphQLEnumType({
  name: 'ExtraService',
  description: `Add an extra service to your letter. Options are certified or registered. Certified provides tracking and delivery confirmation for domestic destinations. Registered provides tracking and confirmation for international addresses.`,
  values: {
    CERTIFIED: {
      name: 'CERTIFIED',
      description: 'Certified mail.',
      value: 'certified'
    },
    REGISTERED: {
      name: 'REGISTERED',
      description: 'Registered mail.',
      value: 'registered'
    },
    NONE: {
      name: 'NONE',
      description: 'None',
      value: null
    }
  }
})

module.exports = GraphQLExtraService
