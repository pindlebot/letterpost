import React from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import { ADDRESS_QUERY } from '../../graphql/queries'
import { UPDATE_ADDRESS } from '../../graphql/mutations'
import AddressKindToggle from '../AddressKindToggle'
import Input from 'antd/lib/input'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Form from 'antd/lib/form'
import classes from './styles.scss'

const uppercase = str => str.substring(0, 1).toUpperCase() + str.substring(1, str.length)

const VALIDATION = {
  name: string => string.length,
  country: string => string.length,
  postalCode: string => /[\d-]{5,10}/.test(string),
  state: string => /[A-Za-z]{2,14}/.test(string),
  street: string => string.length,
  city: string => /[A-Za-z\s-.,']{1,58}/.test(string),
  apt: () => true
}

const Field = ({
  name,
  className,
  address,
  onChange,
  onBlur,
  margin,
  error
}) => (
  <Input
    // error={Boolean(error && error[name])}
    key={name}
    style={{ width: '100%' }}
    placeholder={name}
    value={address[name] || ''}
    onBlur={onBlur}
    onChange={({ currentTarget }) => onChange({ [name]: currentTarget.value })}
    type={'text'}
  />
)

Field.defaultProps = {
  margin: 'none'
}

const KIND = {
  RECIPIENT: 'RECIPIENT',
  SENDER: 'SENDER'
}

class RecipientForm extends React.Component {
  state = {
    kind: KIND.RECIPIENT,
    error: {}
  }

  static propTypes = {
    order: PropTypes.object.isRequired,
    classes: PropTypes.object,
    user: PropTypes.object.isRequired
  }
  static defaultProps = {
    address: {
      name: '',
      street: '',
      apt: '',
      postalCode: '',
      city: '',
      state: ''
    }
  }

  onChange = (element) => {
    let user = this.props.user?.data?.user
    let currentOrder = this.props.order?.data?.currentOrder
    let { kind, error } = this.state
    this.props.client.writeQuery({
      query: ADDRESS_QUERY,
      data: {
        address: {
          ...(kind === KIND.RECIPIENT
            ? currentOrder.contact.address
            : user.returnAddress
          ),
          ...element
        }
      },
      variables: {
        id: currentOrder.contact.address.id
      }
    })
    let key = Object.keys(element)[0]
    let value = element[key]
    if (error[key] && value.length) {
      window.requestAnimationFrame(() => {
        delete error[key]
        return this.setState(prevState => {
          if (!prevState.error[key]) {
            return null
          }
          return { error }
        })
      })
    }
  }

  update = ({ mutate, key }) => ({ currentTarget }) => {
    if (
      !VALIDATION[key](currentTarget.value)
    ) {
      let { error } = this.state
      error[key] = {}
      return this.setState({ error })
    }
    let user = this.props.user?.data?.user
    let currentOrder = this.props.order?.data?.currentOrder
    let { kind } = this.state
    let address = kind === KIND.RECIPIENT
      ? currentOrder.contact.address
      : user.returnAddress

    const { __typename, ...rest } = address
    return mutate({
      variables: {
        input: {
          ...(
            Object.keys(rest).reduce((acc, key) => {
              acc[key] = rest[key] || null
              return acc
            }, {})
          ),
          [key]: currentTarget.value
        }
      }
    })
  }

  handleAlignment = (event, alignment) => {
    this.setState({
      kind: alignment,
      error: {}
    }, () => {
      let user = this.props.user?.data?.user
      let currentOrder = this.props.order?.data?.currentOrder
      if (alignment === 'SENDER' && !user.returnAddress.name) {
        const {
          name,
          street,
          apt,
          postalCode,
          city,
          state,
          country,
          __typename
        } = currentOrder.contact.address
        this.props.client.writeQuery({
          query: ADDRESS_QUERY,
          data: {
            address: {
              name,
              street,
              apt,
              postalCode,
              city,
              state,
              country,
              __typename,
              id: user.returnAddress.id,
              kind: KIND.SENDER
            }
          },
          variables: {
            id: user.returnAddress.id
          }
        })
      }
    })
  }

  render () {
    console.log(this.props)
    let { form } = this.props
    let user = this.props.user?.data?.user
    let currentOrder = this.props.order?.data?.currentOrder

    if (!(currentOrder && currentOrder.contact)) return false

    const address = this.state.kind === KIND.RECIPIENT
      ? currentOrder.contact.address
      : user.returnAddress

    const {
      id,
      __typename,
      country,
      state,
      postalCode,
      kind,
      apt,
      city,
      ...fields
    } = address
    return (
      <Mutation mutation={UPDATE_ADDRESS}>
        {(mutate, { error, data, loading }) => {
          return (
            <div className={classes.root}>
              <Row gutter={16}>
                <Col span={24}>
                  <AddressKindToggle
                    client={this.props.client}
                    user={this.props.user}
                    handleAlignment={this.handleAlignment}
                    kind={this.state.kind}
                  />
                </Col>
              </Row>
              {Object.keys(fields).map(key =>
                <Row gutter={16}>
                  <Col span={24} key={`${key}-grid`}>
                    {form.getFieldDecorator('username', {
                      rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                      <Field
                        key={key}
                        name={key}
                        className={classes.textField}
                        address={address}
                        onChange={this.onChange}
                        onBlur={this.update({ mutate, key })}
                        error={this.state.error}
                      />
                    )}
                  </Col>
                </Row>
              )}
              <Row gutter={16}>
                <Col span={12}>
                  <Field
                    name={'apt'}
                    className={classes.half}
                    address={address}
                    onChange={this.onChange}
                    onBlur={this.update({ mutate, key: 'apt' })}
                    error={this.state.error}
                  />
                </Col>
                <Col span={12}>
                  <Field
                    name={'city'}
                    address={address}
                    onChange={this.onChange}
                    onBlur={this.update({ mutate, key: 'city' })}
                    error={this.state.error}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Field
                    name={'state'}
                    className={classes.half}
                    address={address}
                    onChange={this.onChange}
                    onBlur={this.update({ mutate, key: 'state' })}
                    error={this.state.error}
                  />
                </Col>
                <Col span={12}>
                  <Field
                    name={'postalCode'}
                    address={address}
                    onChange={this.onChange}
                    onBlur={this.update({ mutate, key: 'postalCode' })}
                    error={this.state.error}
                  />
                </Col>
              </Row>
            </div>
          )
        }}
      </Mutation>
    )
  }
}

export default Form.create({ name: 'recipient' })(RecipientForm)
