import React from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'

let DocumentIcon = props => (
  <SvgIcon width='84px' height='104px' viewBox='0 0 84 104' {...props}>
    <g
      id='17.Files'
      stroke='none'
      strokeWidth='1'
      fill='none'
      fillRule='evenodd'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <g
        id='Files-(Color)'
        transform='translate(-1298.000000, -898.000000)'
        stroke={props.fill}
        strokeWidth='3.5'
      >
        <g id='47-files-paper' transform='translate(1300.000000, 900.000000)'>
          <polygon
            id='Layer-1'
            fill={props.background}
            points='60 0 80 20 60 20'
          />
          <polygon
            id='Layer-2'
            fill={props.background}
            points='60 0.23014612 59.7695312 0 0 0 2.70108432e-07 100 80 100 80 20.2021484 79.7975682 20 60 20 60 0.23014612'
          />
          <path d='M10,40 L35,40' id='Layer-3' fill={props.fill} />
          <path d='M10,50 L60,50' id='Layer-4' fill={props.fill} />
          <path d='M10,60 L60,60' id='Layer-5' fill={props.fill} />
          <path d='M10,70 L60,70' id='Layer-6' fill={props.fill} />
          <path d='M10,80 L60,80' id='Layer-7' fill={props.fill} />
        </g>
      </g>
    </g>
  </SvgIcon>
)

DocumentIcon.defaultProps = {
  fill: '#586069',
  background: '#fafafa'
}

export default DocumentIcon
