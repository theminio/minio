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
import { Modal, ModalBody, ModalHeader, ModalTitle, ModalFooter } from "react-bootstrap"

const GetPreviewContent = (bucketName, objectName, folderPrefix, accessKey, secretKey) => {
    console.log(bucketName)
    console.log(folderPrefix)
    console.log(accessKey)
    console.log(secretKey)
    return objectName
}

export class PreviewObjectModal extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {currentBucket, objectName, currentPrefix, hidePreviewModal, accessKey, secretKey} = this.props

        return(
    <Modal
      bsSize="small"
      animation={false}
      show={true}
      className={"modal-confirm "}
    >
      <ModalHeader>
          <ModalTitle>{objectName}</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <div className="mc-text">
            WOW{GetPreviewContent(currentBucket, objectName, currentPrefix, accessKey, secretKey)}
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-link" onClick={hidePreviewModal}>
            Close
        </button>
      </ModalFooter>
    </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
      currentBucket: state.buckets.currentBucket,
      currentPrefix: state.objects.currentPrefix,
      accessKey: state.browser.accessKey,
      secretKey: state.browser.secretKey,
    }
}

export default connect(mapStateToProps)(PreviewObjectModal)
