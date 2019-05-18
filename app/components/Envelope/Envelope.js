import React from 'react'
import Stamp from '../StampSvg'

function Envelope (props) {
  return (
    <div
      style={{
        width: '100%',
        height: '181.25px',
        backgroundColor: 'rgba(0,0,0,.04)',
        border: '1px solid rgba(0,0,0,.05)',
        borderRadius: '2px',
        boxShadow: 'rgba(50, 50, 93, 0.1) 0px 15px 35px, rgba(0, 0, 0, 0.07) 0px 5px 15px'
      }}
    >
      <div style={{padding: '10px'}}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <div>
            lorem ipsum<br />
            lorem ipsum<br />
            lorem ipsum<br />
          </div>
          <div>
            <Stamp />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            padding: '10px'
          }}
        >
          lorem ipsum<br />
          lorem ipsum<br />
          lorem ipsum<br />
        </div>
      </div>
    </div>
  )
}

export default Envelope
