// @flow weak
import React from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import 'isomorphic-fetch'
import {
  DELETE_UPLOAD
} from '../../graphql/mutations'
import { UPLOADS_QUERY, ORDER_QUERY } from '../../graphql/queries'
import LinearProgress from '@material-ui/core/LinearProgress'
import styles from './styles.scss'
import List from 'antd/lib/list'
import Checkbox from 'antd/lib/checkbox'
import Button from 'antd/lib/button'

const formatFileSize = ({ size }) => {
  return size > 1e6
    ? `${Math.round(size / 1e6)} mb`
    : `${Math.round(size / 1e3)} kb`
}

const UploadListItem = ({
  upload,
  color,
  handleClick,
  isChecked,
  deleteUpload
}) => {
  return (
    <List.Item onClick={() => handleClick(upload)} className={styles.listItem}>
      <Checkbox value={isChecked(upload)} className={styles.checkbox} />
      <div className={styles.listItemTitle}>
        <div>{upload.name}</div>
        <div>{formatFileSize(upload)}</div>
      </div>
      {upload.status === 'DONE' && (
        <Button
          aria-label='Delete'
          onClick={() => deleteUpload({ id: upload.id })}
          className={styles.icon}
          shape={'circle'}
          icon={'delete'}
        />
      )}
      {upload.status !== 'DONE' && (
        <div className={styles.progress}>
          <LinearProgress />
        </div>
      )}
    </List.Item>
  )
}

class UploadList extends React.Component {
  static propTypes = {
    order: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    uploads: PropTypes.object.isRequired
  }

  handleClick = (upload) => {
    const { order: { data: { currentOrder } } } = this.props
    console.log({
      currentOrder,
      upload
    })
    return this.props.client.writeQuery({
      query: ORDER_QUERY,
      data: {
        currentOrder: {
          ...currentOrder,
          upload: (currentOrder.upload && currentOrder.upload.id) === upload.id
            ? null
            : upload
        }
      },
      variables: {
        id: currentOrder.id
      }
    })
  }

  isChecked = (upload) => {
    if (!upload) return false
    const { order: { data: { currentOrder } } } = this.props
    return upload.id === currentOrder?.upload?.id
  }

  deleteUpload = ({ mutate }) => variables => mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      deleteUpload: {
        __typename: 'Upload',
        ...variables
      }
    },
    update: (store, { data: { deleteUpload } }) => {
      const data = store.readQuery({ query: UPLOADS_QUERY })
      const uploads = data.uploads
        .filter(upload => upload.id !== deleteUpload.id)
      store.writeQuery({ query: UPLOADS_QUERY, data: { ...data, uploads } })
    }
  })

  render () {
    const { uploads } = this.props
    if (uploads.loading) return false
    const color = 'default'
    return (
      <Mutation mutation={DELETE_UPLOAD}>
        {(mutate) => {
          return (
            <List
              className={styles.list}
              dataSource={uploads?.data?.uploads}
              renderItem={(upload) => (
                <UploadListItem
                  key={upload.id}
                  upload={upload}
                  color={color}
                  handleClick={this.handleClick}
                  isChecked={this.isChecked}
                  deleteUpload={this.deleteUpload({ mutate })}
                />
              )}
            />
          )
        }}
      </Mutation>
    )
  }
}

export default UploadList
