import React from 'react'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'

function QuotePreview () {
  return (
    <FormGroup row>
      <TextField
        InputProps={{
          disableUnderline: true
        }}
        value={''}
        onChange={() => {}}
        placeholder={'pages'}
      />
      <FormControlLabel
        style={{ color: '#fff' }}
        control={
          <Checkbox
            checked
            onChange={() => {}}
            value='color'
          />
        }
        label='Color?'
      />
      <FormControlLabel
        style={{ color: '#fff' }}
        control={
          <Checkbox
            checked
            onChange={() => {}}
            value='double-sided'
          />
        }
        label='Double-sided?'
      />
    </FormGroup>

  )
}

export default QuotePreview
