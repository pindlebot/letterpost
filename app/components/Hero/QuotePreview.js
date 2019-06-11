import React from 'react'
import Input from 'antd/lib/input'
import Checkbox from 'antd/lib/checkbox'

function QuotePreview () {
  return (
    <div>
      <Input
        value={''}
        onChange={() => {}}
        placeholder={'pages'}
      />
      <Checkbox
        onChange={() => {}}
        value='color'
      />
      <Checkbox
        onChange={() => {}}
        value='double-sided'
      />
    </div>
  )
}

export default QuotePreview
