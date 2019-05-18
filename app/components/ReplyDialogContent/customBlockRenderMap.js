import React from 'react'
import type { Node } from 'react'
import { Map } from 'immutable'
import { DefaultDraftBlockRenderMap } from 'draft-js'

export const Block = {
  UNSTYLED: 'unstyled',
  PARAGRAPH: 'unstyled',
  OL: 'ordered-list-item',
  UL: 'unordered-list-item',
  H1: 'header-one',
  H2: 'header-two',
  H3: 'header-three',
  H4: 'header-four',
  H5: 'header-five',
  H6: 'header-six',
  CODE: 'code-block',
  BLOCKQUOTE: 'blockquote',
  PULLQUOTE: 'pullquote',
  ATOMIC: 'atomic',
  BLOCKQUOTE_CAPTION: 'block-quote-caption',
  CAPTION: 'caption',
  TODO: 'todo',
  IMAGE: 'atomic:image',
  BREAK: 'atomic:break'
}

const Blockquote = (props: { children?: Array<Node> }) => (
  <blockquote>{props.children}</blockquote>
)

export default DefaultDraftBlockRenderMap.merge(Map({
  [Block.BLOCKQUOTE]: {
    element: 'div',
    wrapper: <Blockquote />
  },
  [Block.CAPTION]: {
    element: 'cite'
  },
  [Block.BLOCKQUOTE_CAPTION]: {
    element: 'blockquote'
  },
  [Block.TODO]: {
    element: 'div'
  },
  [Block.IMAGE]: {
    element: 'figure'
  },
  [Block.BREAK]: {
    element: 'div'
  }
}))
