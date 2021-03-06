/*
 * MinIO Cloud Storage (C) 2018 MinIO, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react"
import { connect } from "react-redux"
import { Dropdown } from "react-bootstrap"
import ShareObjectModal from "./ShareObjectModal"
import DeleteObjectConfirmModal from "./DeleteObjectConfirmModal"
import PreviewObjectModal from "./PreviewObjectModal"
import * as objectsActions from "./actions"
import {
  SHARE_OBJECT_EXPIRY_DAYS,
  SHARE_OBJECT_EXPIRY_HOURS,
  SHARE_OBJECT_EXPIRY_MINUTES
} from "../constants"

export class ObjectActions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showPreview: false,
      showDeleteConfirmation: false
    }
  }
  shareObject(e) {
    e.preventDefault()
    const { object, shareObject } = this.props
    shareObject(
      object.name,
      SHARE_OBJECT_EXPIRY_DAYS,
      SHARE_OBJECT_EXPIRY_HOURS,
      SHARE_OBJECT_EXPIRY_MINUTES
    )
  }
  deleteObject() {
    const { object, deleteObject } = this.props
    deleteObject(object.name)
  }
  showDeleteConfirmModal(e) {
    e.preventDefault()
    this.setState({ showDeleteConfirmation: true })
  }
  hideDeleteConfirmModal() {
    this.setState({
      showDeleteConfirmation: false
    })
  }
  showPreviewModal(e) {
    e.preventDefault()
    this.setState({ showPreview: true })
  }
  hidePreviewModal() {
    this.setState({
      showPreview: false
    })
  }
  render() {
    const { object, currentBucket, currentPrefix, showShareObjectModal, shareObjectName } = this.props
    return (
      <Dropdown id={`obj-actions-${object.name}`}>
        <Dropdown.Toggle noCaret className="fia-toggle" />
        <Dropdown.Menu>
          <a
            href=""
            className="fiad-action"
            onClick={this.shareObject.bind(this)}
          >
            <i className="fa fa-share-alt" />
          </a>
          <a
            href=""
            className="fiad-action"
            onClick={this.showDeleteConfirmModal.bind(this)}
          >
            <i className="fa fa-trash" />
          </a>
          <a
            href=""
            className="fiad-action"
            onClick={this.showPreviewModal.bind(this)}
          >
            <i className="fa fa-eye" />
          </a>
        </Dropdown.Menu>
        {(showShareObjectModal && shareObjectName === object.name) &&
          <ShareObjectModal object={object} />}
        {this.state.showDeleteConfirmation && (
          <DeleteObjectConfirmModal
            deleteObject={this.deleteObject.bind(this)}
            hideDeleteConfirmModal={this.hideDeleteConfirmModal.bind(this)}
          />
        )}
        {this.state.showPreview && (
          <PreviewObjectModal
            bucketName={currentBucket}
            folderPrefix={currentPrefix}
            objectName={object.name}
            hidePreviewModal={this.hidePreviewModal.bind(this)}
          />
        )}
      </Dropdown>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentBucket: state.buckets.currentBucket,
    currentPrefix: state.objects.currentPrefix,    
    object: ownProps.object,
    showShareObjectModal: state.objects.shareObject.show,
    shareObjectName: state.objects.shareObject.object
  }
}

const mapDispatchToProps = dispatch => {
  return {
    shareObject: (object, days, hours, minutes) =>
      dispatch(objectsActions.shareObject(object, days, hours, minutes)),
    deleteObject: object => dispatch(objectsActions.deleteObject(object))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ObjectActions)
