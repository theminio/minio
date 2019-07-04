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
import { Modal, ModalBody, ModalHeader, ModalTitle, ModalFooter } from "react-bootstrap"
import '../../css/preview.css'

export class PreviewObjectModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            previewContent : ""
        }

        const {bucketName, objectName, folderPrefix, accessKey, secretKey} = props

        let extension = objectName.split(".").pop()
    
        const mapExtensionToElementType = {
            mp3 : "VIDEO",
            mp4 : "VIDEO",
            avi : "VIDEO",
            png : "IMAGE",
            jpg : "IMAGE",
            jpeg : "IMAGE",
            gif : "IMAGE",
            tif : "IMAGE",
            csv : "CSV",
            avsc : "AVRO",
            avro : "AVRO",
            txt : "TXT"
        }
    
        if((!(objectName.includes("."))) || (!(extension in mapExtensionToElementType))) {
            extension = "txt"
        }

        const getApiURL = () => {
            const portPreview = ":8080"
            if(window.location.protocol === "https:") {
                let oldHostName = window.location.hostname
                let updatedHostName = oldHostName.split('.')[0] + "-preview"

                return window.location.protocol + "//" + updatedHostName + 
                       oldHostName.substring(oldHostName.indexOf(".")) + portPreview
            }

            return "http://127.0.0.1" + portPreview
        }
    
        let previewContent = () => {
            const API_URL = getApiURL()
            console.log(API_URL)
            const requestInfo = {
                bucketName : bucketName,
                folderPrefix : folderPrefix,
                objectName : objectName,
            }
            fetch(API_URL + "/preview", {
                headers : {
                    "Accept" : "application/json",
                    "Content-Type" : "application/json"
                },
                method : "POST",
                body : JSON.stringify(requestInfo)
            })
            .then(response => response.json())
            .then(responseData => {
                let previewHeaders, previewData
                const tableStyle = {
                    margin : "auto"
                }
                const imageOrVideoStyle = {
                    width : "100%"
                }
                const mapElementTypeToComponent = {
                    VIDEO : () => {
                        let videoType = "video/" + extension
        
                        return (
                            <video controls style={imageOrVideoStyle}>
                                <source src={responseData} type={videoType}/>
                            </video>
                        )
                    },
                    IMAGE : () => {
                        return (
                            <img src={responseData} alt="" style={imageOrVideoStyle}/>
                        )
                    },
                    CSV : () => {        
                        let headers = responseData[0].split(",")
                        let data = responseData.slice(1)
                        previewHeaders = headers.map(previewHeader => {
                            return (
                                <th key={previewHeader} className="HeaderCell">
                                    {previewHeader}
                                </th>
                            )
                        })
                        previewData = data.map((rowData, rowIndex) => {
                            let row = rowData.split(",")
                            let rowResult = row.map((rowCell, colIndex) => {
                                return (
                                    <td key={"" + rowIndex + ":" + colIndex} className="DataCell">{rowCell}</td>
                                )
                            })
                            return (
                                <tr key={rowIndex} className="Row">
                                    {rowResult}
                                </tr>
                            )
                        })
                        return (
                            <table style={tableStyle}>
                                <thead>
                                    <tr className="Header">
                                        {previewHeaders}
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData}
                                </tbody>
                            </table>
                        )
                    },
                    AVRO : () => {
                        let fields = JSON.parse(responseData)["fields"]
                        previewHeaders = ["Field", "Type"].map(previewHeader => {
                            return (
                                <th key={previewHeader} className="HeaderCell">
                                    {previewHeader}
                                </th>
                            )
                        })
                        previewData = fields.map(field => {
                            return (
                                <tr key={field["name"]} className="Row">
                                    <td className="DataCell">{field["name"]}</td>
                                    <td className="DataCell">{field["type"]}</td>
                                </tr>
                            )
                        })
                        return (
                            <table style={tableStyle}>
                                <thead>
                                    <tr className="Header">
                                        {previewHeaders}
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData}
                                </tbody>
                            </table>
                        )
                    },
                    TXT : () => {
                        let textStyle = {
                            textAlign : "left"
                        }
                        let rows = responseData.split("\r\n").map((row, index) => {
                            return (
                                <h5 key={index}>{row}</h5>
                            )
                        })
        
                        return (
                            <div style={textStyle}>{rows}</div>
                        )
                    }
                }
                
                this.setState({
                    previewContent : mapElementTypeToComponent[mapExtensionToElementType[extension]]()
                })
            })
        }

        previewContent()
    }   

    render() {
        const {objectName, hidePreviewModal} = this.props
        const modalStyle = {
            // width : "90vw"
        }
        const contentStyle = {
            overflowX : "auto",
        }

        return(
    <Modal
    //   bsSize="small"
    //   animation={false}
      show={true}
      className={"modal-confirm "}
      aria-labelledby="contained-modal-title-vcenter"
      style={modalStyle}
      centered={true}
      scrollable={true}
      >
      <ModalHeader>
          <ModalTitle>{objectName}</ModalTitle>
      </ModalHeader>
      <ModalBody style={contentStyle}>
        {this.state.previewContent}
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

export default PreviewObjectModal
