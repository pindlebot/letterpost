import React from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import Paper from 'material-ui/Paper'
import withStyles from 'material-ui/styles/withStyles';

require('isomorphic-fetch')

const styles = {
  dropzone: {
    width: '400px',
    height: '300px',
    backgroundColor: '#fafafa',
    marginTop: '1em',
    marginBottom: '1em',
  }
}

class PdfDropzone extends React.Component {
  constructor(props) {
    super(props)

    this.state = { 
     
    }
    this.onDrop = this.onDrop.bind(this)
  }

  async onDrop(files) {
    const file = files[0]
    const reader = new FileReader()
    
    reader.onload = () => {
      var typedarray = new Uint8Array(reader.result);
      this.props.socket.send(typedarray)
    }
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.readAsArrayBuffer(file)
  }

  render() {
    var {details, classes} = this.props;
    return (
      <div>
      {details ? details.Location : ''}
      <Dropzone 
        style={{}}
        onDrop={this.onDrop} 
        >
        <Paper zDepth={1} className={classes.dropzone}>
        
        </Paper>
      </Dropzone>
      </div>
    )
  }
}

export default withStyles(styles)(PdfDropzone)