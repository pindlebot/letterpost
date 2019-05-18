import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'

import {
  CharacterMetadata,
  ContentBlock,
  genKey,
  Editor,
  EditorState,
  ContentState, 
  convertToRaw,
  convertFromHTML,
  convertTo
} from 'draft-js'

import { withStyles } from '@material-ui/core/styles'
import ToggleButton, { ToggleButtonGroup } from '@material-ui/lab/ToggleButton'
import ListIcon from '@material-ui/icons/List'
import FormatBoldIcon from '@material-ui/icons/FormatBold'
import FormatItalicIcon from '@material-ui/icons/FormatItalic'
import FormatQuoteIcon from '@material-ui/icons/FormatQuote'
import Button from '@material-ui/core/Button'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import 'draft-js/dist/Draft.css'
import Input from '@material-ui/core/Input'
import FormControl from '@material-ui/core/FormControl'
import EmailIcon from '@material-ui/icons/Email'
import SubjectIcon from '@material-ui/icons/Subject'
import InputAdornment from '@material-ui/core/InputAdornment'
import customBlockRenderMap from './customBlockRenderMap'
import './editor.scss'
import classnames from 'classnames'
import { List, Map, Repeat } from 'immutable'

const SEND_EMAIL = gql`
  mutation($input: SendMessageInput!) {
    sendMessage(input: $input)
  }
`

function createEmptyBlock () {
  const newBlockKey = genKey()
  const text = ' '
  const newBlock = new ContentBlock({
    key: newBlockKey,
    type: 'unstyled',
    text: text,
    characterList: List(Repeat(CharacterMetadata.EMPTY, text.length)),
    depth: 0,
    data: Map()
  })

  return newBlock
}

const dialogContentStyles = {
  toggleButtonGroup: {

  },
  editor: {
    minHeight: '200px'
  },
  toggleButton: {
    padding: '6px 0px'
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    minHeight: '120px'
  },
  adornment: {
    marginRight: '8px'
  }
}

class ReplyDialogContent extends React.Component {
  state = {
    editorState: EditorState.createEmpty(),
    loading: false,
    subject: '',
    recipients: ['']
  }

  onChange = editorState => {
    this.setState({ editorState })
  }

  manualSave = () => {}
  insertImage = () => {}

  componentDidMount () {
    const { message } = this.props
    if (message) {
      let html = message.html || message.textAsHtml || message.text
      let blocksFromHTML = convertFromHTML(`<blockquote>${html}</blockquote>`)
      console.log(blocksFromHTML)
      blocksFromHTML.contentBlocks.unshift(
        createEmptyBlock()
      )
      let contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      )
      let editorState = EditorState.createWithContent(contentState)
      const {
        message: {
          subject,
          from: {
            value
          }
        }
      } = this.props
      let recipients = value.map(({ address }) => address)
      this.setState({
        editorState,
        subject,
        recipients
      })
    }
  }

  handleRecipientsChange = evt => {
    this.setState({
      recipients: evt.target.value.split(/,\s*/g).map(addr => addr.trim())
    })
  }

  handleSubjectChange = evt => {
    this.setState({
      subject: evt.target.value
    })
  }

  sendEmail = (evt) => {
    const {
      user: {
        emailAddress
      }
    } = this.props
    let { editorState, subject, recipients } = this.state
    let currentContent = editorState.getCurrentContent().getPlainText('\n')
    const input = {
      toAddresses: recipients,
      html: currentContent.split('\n').map(line => `<p>${line}</p>`).join('\n'),
      text: currentContent,
      subject: subject,
      fromAddress: emailAddress
    }
    this.props.mutate({
      variables: {
        input
      }
    }).then(() => {
      this.props.handleClose()
    })
  }
  render () {
    const { classes } = this.props
    const { subject, recipients } = this.state
    return (
      <React.Fragment>
        <DialogContent>
          <div className={classes.formContainer}>
            <FormControl fullWidth>
              <Input
                type={'text'}
                value={subject}
                onChange={this.handleSubjectChange}
                disabled={this.state.disabled}
                disableUnderline
                endAdornment={
                  <InputAdornment position='end' className={classes.adornment}>
                    <SubjectIcon />
                  </InputAdornment>
                }
                placeholder={'Subject'}
              />
            </FormControl>
            <FormControl fullWidth>
              <Input
                type={'text'}
                value={recipients.join(', ')}
                onChange={this.handleRecipientsChange}
                disabled={this.state.disabled}
                disableUnderline
                endAdornment={
                  <InputAdornment position='end' className={classes.adornment}>
                    <EmailIcon />
                  </InputAdornment>
                }
                placeholder={'Recipients'}
              />
            </FormControl>
          </div>
          <div>
            <ToggleButtonGroup
              value={this.state.alignment}
              exclusive
              onChange={this.handleAlignment}
              className={this.props.classes.toggleButtonGroup}
            >
              <ToggleButton value={'list'} className={classes.toggleButton}>
                <ListIcon />
              </ToggleButton>
              <ToggleButton value={'quote'} className={classes.toggleButton}>
                <FormatQuoteIcon />
              </ToggleButton>
              <ToggleButton value={'bold'} className={classes.toggleButton}>
                <FormatBoldIcon />
              </ToggleButton>
              <ToggleButton value={'italic'} className={classes.toggleButton}>
                <FormatItalicIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div className={classnames(classes.editor, 'editor')}>
            <Editor
              editorState={this.state.editorState}
              onChange={this.onChange}
              blockRenderMap={customBlockRenderMap}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.sendEmail}>Send</Button>
        </DialogActions>
      </React.Fragment>
    )
  }
}

export default withStyles(dialogContentStyles)(props => (
  <Mutation mutation={SEND_EMAIL}>
    {mutate => {
      return (
        <ReplyDialogContent {...props} mutate={mutate} />
      )
    }}
  </Mutation>
))
