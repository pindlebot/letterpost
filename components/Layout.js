
/* eslint-disable flowtype/require-valid-file-annotation */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import withStyles from 'material-ui/styles/withStyles';
import withRoot from './withRoot';
import Header from './Header'

const styles = {
  root: {
    fontFamily: 'Open Sans, sans-serif',
  },
  wrapper: {
    maxWidth: '660px',
    margin: '1em auto'
  }
};

class Layout extends Component {

  render() {
    var {classes} = this.props
    return (
      <div className={classes.root}>
        <Header />
        
        <div className={classes.wrapper}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Layout))