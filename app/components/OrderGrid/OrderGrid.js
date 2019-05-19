import React from 'react'
import Grid from '@material-ui/core/Grid'
import classnames from 'classnames'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import AttachmentIcon from '@material-ui/icons/Attachment'
import OrderStepHeading from 'OrderStepHeading'
import FormHelperText from '@material-ui/core/FormHelperText'
import OrderCard from 'OrderCard'
import PersonIcon from '@material-ui/icons/Person'
import LinearProgress from '@material-ui/core/LinearProgress'
import PaymentMethods from 'PaymentMethods'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import EditEmailTextField from 'EditEmailTextField'
import { Mutation } from 'react-apollo'
import Quote from 'Quote'
import OrderDetailsOptions from 'OrderDetailsOptions'

class GridItem extends React.Component {
  render () {
    const {
      classes,
      container,
      label,
      step,
      primary
    } = this.props

    return (
      <Grid
        item
        xs={12}
        sm={6}
        className={classes.left}
        container={container}
      >
        {primary ? (
          <List className={classes.half}>
            <ListItem>
              <ListItemIcon><AttachmentIcon /></ListItemIcon>
              <ListItemText
                inset
                primary={primary}
              />
            </ListItem>
          </List>
        ) : (
          <OrderStepHeading step={step} label={label} />
        )}
      </Grid>
    )
  }
}

const GridRow = props => (
  <Grid container item direction={'row'} className={props.className}>{props.children}</Grid>
)

const GridColumn = ({ children, left, right, classes, container }) => (
  <Grid
    container={container}
    item
    xs={12}
    sm={6}
    className={
      classnames({
        [classes.left]: left,
        [classes.right]: right
      })
    }>
    {children}
  </Grid>
)

class EditEmailTextFieldWithMutations extends React.Component {
  updateUser = mutate => variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      updateUser: {
        ...variables.input,
        __typename: 'User'
      }
    }
  })

  render () {
    return (
      <Mutation mutation={UPDATE_USER}>
        {(mutate, { error, data, loading }) => (
          <EditEmailTextField
            {...this.props}
            updateUser={this.updateUser(mutate)}
          />)
        }
      </Mutation>
    )
  }
}

class OrderGrid extends React.Component {
  render () {
    const { classes, ...other } = this.props
    const {
      order,
      pending,
      complete,
      error
    } = this.props
    const currentOrder = order?.data?.currentOrder
    const user = this.props.user?.data?.user
    let upload = currentOrder?.upload
    let contact = currentOrder?.contact
    let letter = currentOrder?.letter
    return (
      <Grid container direction={'column'} spacing={40}>
        <GridRow className={classnames(classes.grid, error.upload ? classes.error : '')}>
          <GridColumn left classes={classes} container={!upload}>
            {upload ? (
              <List className={classes.half}>
                <ListItem>
                  <ListItemIcon><AttachmentIcon /></ListItemIcon>
                  <ListItemText
                    inset
                    primary={(upload.name) || ''}
                  />
                </ListItem>
              </List>
            ) : (
              <OrderStepHeading step={1} label={'Add a document'} />
            )}
          </GridColumn>
          <GridColumn container classes={classes} right>
            <Button
              onClick={() => this.props.handleOpen('dropzone')}
              variant={'contained'}
              color={'primary'}
              disabled={complete || pending}
            >
              Upload Documents
            </Button>
          </GridColumn>
        </GridRow>
        <GridRow className={classnames(classes.grid, error.contact ? classes.error : '')}>
          <GridColumn container={!(contact?.address?.name)} classes={classes} left>
            {contact?.address?.name ? (<List className={classes.half}>
              <ListItem>
                <ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText
                  inset
                  primary={contact?.address?.name}
                />
              </ListItem>
            </List>) : (
              <OrderStepHeading step={2} label={'Add a shipping address'} />
            )}
          </GridColumn>
          <GridColumn container classes={classes} right>
            <Button
              onClick={() => this.props.handleOpen('addressbook')}
              variant={'contained'}
              color={'primary'}
              disabled={complete || pending}
            >
              Add Recipient
            </Button>
          </GridColumn>
        </GridRow>
        <GridRow className={classnames(classes.grid, error.card ? classes.error : '')}>
          <GridColumn left classes={classes} container={!user?.cards?.length}>
            {user?.cards?.length
              ? (<PaymentMethods {...other} />)
              : (<OrderStepHeading step={3} label={'Add a payment method'} />)}
          </GridColumn>
          <GridColumn container classes={classes} right>
            <Button
              variant={'contained'}
              color={'primary'}
              onClick={() => this.props.handleOpen('stripe')}
              disabled={complete || pending}
            >Add Card</Button>
          </GridColumn>
        </GridRow>
        <GridRow className={classnames(classes.grid, error.card ? classes.error : '')}>
          <GridColumn
            classes={classes}
            left
            container
          >
            <OrderStepHeading step={4} label={'Add an email address'} />
          </GridColumn>
          <GridColumn container classes={classes} right>
            <EditEmailTextFieldWithMutations {...other} />
          </GridColumn>
        </GridRow>
        <GridRow className={classes.grid}>
          <Grid item xs={12}>
            <OrderDetailsOptions {...other} />
          </Grid>
        </GridRow>
        <GridRow className={classes.grid}>
          {pending && <LinearProgress color={'primary'} />}
          <Grid item xs={12} sm={6} className={classes.left}>
            <FormControl required error={typeof error.terms !== 'undefined'} component={'fieldset'}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.props.accept}
                    onCheckboxChange={this.props.onCheckboxChange}
                  />
                }
                label={<FormHelperText className={classes.formHelperText}><span>I accept the <a href='/terms'>terms and conditions</a></span></FormHelperText>}
              />
            </FormControl>
          </Grid>
          <Grid container item xs={12} sm={6} className={classes.right}>
            <Quote
              currentOrder={currentOrder}
              classes={classes}
            />
            <Button
              onClick={this.props.preSubmit}
              variant={'contained'}
              color={'primary'}
              disabled={complete || pending}
            >
            Review & Submit
            </Button>
          </Grid>
        </GridRow>
        {letter && <OrderCard order={currentOrder} />}
      </Grid>
    )
  }
}

export default OrderGrid
