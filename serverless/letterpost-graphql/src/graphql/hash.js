const bcrypt = require('bcryptjs')
const { ValidationError, AuthenticationError } = require('apollo-server-lambda')
const db = require('dynamodb-tools')

const USERS_TABLE = `${process.env.DYNAMODB_PREFIX}-users`

class Hash {
  constructor ({
    password,
    emailAddress,
    saltWorkFactor = 10
  }) {
    this.password = password
    this.emailAddress = emailAddress
    this.saltWorkFactor = saltWorkFactor
  }

  async create () {
    if (this.password.length < 5) {
      throw new ValidationError('Passwords must be at least 5 characters')
    }

    const salt = await bcrypt.genSalt(this.saltWorkFactor)
    return bcrypt.hash(this.password, salt)
  }

  async verify () {
    const user = await this.getUserByEmail()
      .catch(err => {
        throw err
      })
    if (!user) {
      throw new AuthenticationError('User not found.')
    }
    const result = await bcrypt.compare(this.password, user.password)

    if (!result) {
      throw new AuthenticationError('Incorrect password.')
    }

    return { user: user, result }
  }

  getUserByEmail () {
    return db(USERS_TABLE).get({ emailAddress: this.emailAddress })
      .then(users => users && users.length
        ? users[0]
        : undefined
      )
  }
}

module.exports = Hash
