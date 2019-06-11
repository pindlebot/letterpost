import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { compose } from 'react-apollo'
import Button from 'antd/lib/button'

const styles = {
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  button: {
    maxWidth: '160px',
    backgroundColor: '#06CB6D',
    borderColor: '#06CB6D',
    color: '#fff',
    '&:hover': {
      color: '#fff',
      backgroundColor: '#06B964',
      borderColor: '#06B964'
    }
  },
  typography: {
    color: '#fff',
    fontWeight: 400,
    fontSize: 20
  },
  h1: {
    color: '#fff',
    fontSize: 28,
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
            <h3 className={classes.h1}>
                Print Documents to Your Mailbox
            </h3>
            <h4 className={classes.typography}>
                Upload documents and get them in the mail a few days later.
            </h4>
          </div>
          <Button
            // variant={'contained'}
            className={props.classes.button}
            // color={'primary'}
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
