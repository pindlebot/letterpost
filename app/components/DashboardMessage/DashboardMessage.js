import React from 'react'
import FavoriteIcon from '@material-ui/icons/Favorite'
import IconButton from '@material-ui/core/IconButton'
import ReplyIcon from '@material-ui/icons/Reply'
import DeleteIcon from '@material-ui/icons/Delete'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'

class DashboardMessage extends React.Component {

  handleDelete = async () => {
    let { message: { id } } = this.props
    await this.props.deleteMessage({
      variables: { id },
      optimisticResponse: {
        __typename: 'Mutation',
        deleteMessage: {
          __typename: 'Message',
          id: id
        }
      }
    })
  }

  render () {
    const { message } = this.props
    const {
      html,
      text,
      textAsHtml,
      subject,
      from: {
        text: fromText
      }
    } = message
    let messageBody = html && html !== 'false'
      ? html
      : (textAsHtml || text)

    return (
      <div>
        <Card>
          <CardHeader
            title={subject}
            subheader={fromText}
          />
          <CardActions className={''} disableActionSpacing>
            <IconButton aria-label={'Add to favorites'}>
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label={'Reply'} onClick={this.props.handleReplyClick}>
              <ReplyIcon />
            </IconButton>
            <IconButton aria-label={'Delete'} onClick={this.handleDelete}>
              <DeleteIcon />
            </IconButton>
          </CardActions>
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: messageBody }} />
          </CardContent>
        </Card>
      </div>
    )
  }
}

export default DashboardMessage
