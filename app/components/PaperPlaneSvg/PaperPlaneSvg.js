import React from 'react'
import pure from 'recompose/pure'
import SvgIcon from '@material-ui/core/SvgIcon'

let PaperPlane = props => (
  <SvgIcon {...props}>

    <polygon points='22,30.532 0,23.324 58.064,7.532 36,50.532 ' />
    <polygon points='22,30.532 20,46.532 28.594,39.952 ' />
    <path d='M21.462,29.689c-0.203,0.129-0.329,0.324-0.398,0.536L22,30.532l0.574,0.82L57.189,9.237l0.875-1.705 l-3.345,0.91L21.462,29.689z' />
    <g />
    <g />
    <g />
    <g />
    <g />
    <g />
    <g />
    <g />
    <g />
    <g />
    <g />
    <g />
    <g />
    <g />
    <g />

  </SvgIcon>
)

PaperPlane = pure(PaperPlane)
PaperPlane.muiName = 'SvgIcon'
PaperPlane.defaultProps = {
  viewBox: '0 0 58.064 58.064'
}

export default PaperPlane
