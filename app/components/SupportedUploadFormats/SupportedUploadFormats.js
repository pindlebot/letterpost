import React from 'react'

const SupportedUploadFormats = ({ classes }) => (
  <div className={classes.row}>
    <div className={classes.icons}>
      <i
        className='fa fa-file-word-o'
        aria-hidden='true'
        style={{ fontSize: '48px', color: 'rgba(27,31,35,0.15)', marginRight: '10px' }}
      />
      <i
        className='fa fa-file-pdf-o'
        aria-hidden='true'
        style={{ fontSize: '48px', color: 'rgba(27,31,35,0.15)', marginRight: '10px' }}
      />
      <i
        className='fa fa-file-image-o'
        aria-hidden='true'
        style={{ fontSize: '48px', color: 'rgba(27,31,35,0.15)' }}
      />
    </div>
  </div>
)

export default SupportedUploadFormats
