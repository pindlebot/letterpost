// @flow
import React from 'react'
import Monograph from 'monograph/lib/Monograph'
import plugins from 'monograph/lib/plugins'
import LinearProgress from '@material-ui/core/LinearProgress'
import { withStyles } from '@material-ui/core/styles'
import 'monograph/lib/css/normalize.css'
import 'monograph/lib/css/Draft.css'
import 'monograph/lib/css/prism.css'
import 'monograph/lib/css/CheckableListItem.css'
import 's3-dropzone/lib/styles.css'
import 'draft-js-code-block-plugin/lib/style.css'

const Toolbar = plugins.customToolbarPlugin.CustomToolbar

const config = {
  IDENTITY_POOL_ID: 'us-east-1_7lMalRVk3',
  AWS_REGION: 'us-east-1',
  AWS_BUCKET_NAME: 'letterpost-email',
  AWS_BUCKET_URL: ''
}

const awsConfig = {
  identityPoolId: config.IDENTITY_POOL_ID,
  region: config.AWS_REGION,
  bucketName: config.AWS_BUCKET_NAME,
  endpoint: config.AWS_BUCKET_URL + '/'
}

const styles = theme => ({
  footer: {
    position: 'fixed',
    width: '100%',
    bottom: 0,
    left: 0,
    right: 0,
    height: 45,
    zIndex: 500,
    backgroundColor: '#4c6072',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flexStart',
    alignItems: 'center'
  },
  toolbar: {
    width: '100%',
    height: 40,
    padding: '0 74px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  root: {
    width: '100%'
  },
  colorPrimary: {
    backgroundColor: '#9bacbf'
  },
  barColorPrimary: {
    backgroundColor: '#4c6072'
  }
})

const MonographEditor = props => {
  const {
    classes,
    editorState,
    deleteImage,
    createImage,
    message,
    onChange,
    mutate,
    save,
    insertImage,
    loading,
    ...rest /* eslint-disable-line */
  } = props
  const toolbarProps = {
    config: awsConfig,
    id: message.id,
    images: [],
    deleteImage,
    createImage,
    insertImage
  }
  const variant = loading ? 'indeterminate' : 'determinate'
  return (
    <React.Fragment>
      <Monograph
        editorState={editorState}
        onChange={onChange}
        save={save}
        plugins={plugins.plugins}
      />
      <div className={classes.footer}>
        <LinearProgress
          value={100}
          variant={variant}
          classes={{
            root: classes.root,
            colorPrimary: classes.colorPrimary,
            barColorPrimary: classes.barColorPrimary
          }}
        />
        <Toolbar {...toolbarProps} />
      </div>
    </React.Fragment>
  )
}

export default withStyles(styles)(MonographEditor)
