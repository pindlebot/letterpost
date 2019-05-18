import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { compose } from 'react-apollo'

const styles = {
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  button: {
    maxWidth: '160px'
  },
  typography: {
    color: 'rgba(23,42,58,1)',
    fontWeight: 400
  },
  h1: {
    color: '#123',
    fontWeight: 700
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginTop: '60px',
    height: '260px',
    padding: '40px'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  hero: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: '40px'
  }
}

const Hero = (props) => {
  const classes = props.classes
  const testArr = new Array(6)
  testArr.fill('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
  return (
    <div style={{
      display: 'grid',
      gridGap: '0'
    }}>
      <div className={classes.row}>
        <div className={classes.column}>
          <div>
            <Typography
              variant='h3'
              className={classes.h1}
              gutterBottom
            >
                Print Documents to Your Mailbox
            </Typography>
            <Typography
              variant='h4'
              className={classes.typography}
            >
                Upload documents and get them in the mail a few days later.
            </Typography>
          </div>
          <Button
            variant={'contained'}
            className={props.classes.button}
            color={'primary'}
            onClick={() => {
              props.clickCTA()
            }}
          >
              Try It
          </Button>
        </div>
        <div />
      </div>
    </div>
  )
}

Hero.propTypes = {
  classes: PropTypes.object.isRequired
}

export default compose(
  connect(
    state => ({ _state: state }),
    dispatch => ({
      clickCTA: () => dispatch(push('/order'))
    })
  ),
  withStyles(styles)
)(Hero)
