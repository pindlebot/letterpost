import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Mutation } from 'react-apollo'
import { USER_QUERY } from '../../graphql/queries'
import {
  DELETE_CARD,
  CREATE_CARD,
  UPDATE_PRIMARY_CARD
} from '../../graphql/mutations'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import CreditCardIcon from '@material-ui/icons/CreditCard'
import PaymentMethodsIconButton from '../PaymentMethodsIconButton'

const styles = {
  root: {
    width: '100%'
  }
}

const ID = () => {
  return '_' + Math.random().toString(36).substr(2, 9)
}

const generateListItemText = ({ card }) => {
  if (card && card.brand && card.last4) {
    return `${card.brand} - ${card.last4}`
  }

  return 'Add Payment Method'
}

class TakeMoney extends React.Component {
  static propTypes = {
    createCard: PropTypes.object,
    deleteCard: PropTypes.object,
    updatePrimaryCard: PropTypes.object,
    classes: PropTypes.object
  }

  state = {
    anchorEl: undefined
  }

  onToken = async (token) => {
    const {
      user: {
        data: {
          user
        }
      }
    } = this.props
    this.handleClose().then(() =>
      this.props.createCard.mutate({
        input: {
          user: user.id,
          stripeTokenId: token.id,
          stripeEmail: token.email
        }
      })
    )
  }

  selectCard = async (e, card) => {
    this.handleClose().then(() =>
      this.props.updatePrimaryCard.mutate({
        primaryCard: card.id
      })
    )
  }

  deletePrimaryCard = () => {
    const { user: { data: { user } } } = this.props

    this.props.deleteCard.mutate({
      id: user.primaryCard.id
    })
  }

  handleClose = () => {
    return new Promise((resolve, reject) =>
      this.setState({ anchorEl: undefined }, resolve)
    )
  }

  handleClickListItem = ({ currentTarget }) => {
    this.setState({
      anchorEl: currentTarget
    })
  }

  render () {
    const loading = this.props.createCard.loading ||
      this.props.updatePrimaryCard.loading ||
      this.props.deleteCard.loading
    const {
      user: {
        data: {
          user
        }
      },
      order: {
        data: {
          currentOrder
        }
      }
    } = this.props

    const { cards, primaryCard, emailAddress = '' } = user
    const listItemText = generateListItemText({ card: primaryCard })
    const disabled = currentOrder?.paid || false
    return (
      <div className={this.props.classes.root}>
        <List>
          <ListItem
            button
            aria-haspopup='true'
            aria-controls='lock-menu'
            aria-label='Payment'
            onClick={this.handleClickListItem}
            disabled={disabled}
          >
            <ListItemIcon color='inherit'>
              <CreditCardIcon />
            </ListItemIcon>
            <ListItemText primary={listItemText} />
            <ListItemSecondaryAction>
              <PaymentMethodsIconButton
                deletePrimaryCard={evt => this.props.deleteCard.mutate({ id: user.primaryCard.id })}
                primaryCard={user.primaryCard}
                loading={loading}
                disabled={disabled}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        <Menu
          id='lock-menu'
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
          style={{width: '100%'}}
          disabled={disabled}
        >
          {cards.map(card => (
            <MenuItem
              key={card.id}
              selected={(primaryCard && primaryCard.id) === card.id}
              onClick={(evt) => this.selectCard(evt, card)}
            >
              {generateListItemText({ card })}
            </MenuItem>
          ))}
        </Menu>
      </div>
    )
  }
}

const TakeMoneyWithStyles = withStyles(styles)(TakeMoney)

export default class PaymentMutations extends React.Component {
  updatePrimaryCard = ({ mutate }) => variables =>
    mutate({
      variables,
      optimisticResponse: {
        __typename: 'Mutation',
        updatePrimaryCard: {
          __typename: 'User',
          ...this.props.user.data.user,
          primaryCard: {
            __typename: 'primaryCard',
            ...(this.props.user.data.user.cards.find(({ id }) => id === variables.primaryCard))
          }
        }
      }
    })

  deleteCard = ({ mutate }) => variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      deleteCard: {
        __typename: 'Card',
        ...variables
      }
    },
    update: (store, { data: { deleteCard } }) => {
      const { user } = store.readQuery({ query: USER_QUERY })
      user.cards = user.cards.filter(o => o.id !== variables.id)
      user.primaryCard = null
      store.writeQuery({
        query: USER_QUERY,
        data: {
          user: user
        }
      })
    }
  })

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
        id: ID()
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

  render () {
    return (
      <Mutation mutation={UPDATE_PRIMARY_CARD}>
        {(updatePrimaryCard, { loading: updateLoading }) => {
          return (
            <Mutation mutation={DELETE_CARD}>
              {(deleteCard, { loading: deleteLoading }) => {
                return (
                  <Mutation mutation={CREATE_CARD}>
                    {(createCard, { loading: createLoading }) => {
                      return (
                        <TakeMoneyWithStyles
                          updatePrimaryCard={{
                            mutate: this.updatePrimaryCard({ mutate: updatePrimaryCard }),
                            loading: updateLoading
                          }}
                          deleteCard={{
                            mutate: this.deleteCard({ mutate: deleteCard }),
                            loading: deleteLoading
                          }}
                          createCard={{
                            mutate: this.createCard({ mutate: createCard }),
                            loading: createLoading
                          }}
                          {...this.props}
                        />
                      )
                    }}
                  </Mutation>
                )
              }}
            </Mutation>
          )
        }}
      </Mutation>
    )
  }
}
