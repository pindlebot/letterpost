import React from 'react'

function LetterPreview (props) {
  return (
    <div>
      <div
        className='envelope-top'
        style={{
          borderBottom: '75px solid #ddd',
          borderLeft: '125px solid transparent',
          borderRight: '125px solid transparent',
          height: '0',
          width: '1px',
          marginBottom: '-20px'
        }}
      />
      <div style={{
        width: '250px',
        backgroundColor: '#ddd'
      }}>
        <div />
        <img
          src={'https://www.smashingmagazine.com/wp-content/uploads/2015/06/10-dithering-opt.jpg'}
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 20%, 50% 50%, 0% 20%)'
          }}
          width='250px'
        />
      </div>
    </div>
  )
}

export default LetterPreview
