import React, { Component } from 'react'
import Studio from 'jsreport-studio'

let _imageUploadButton

export default class ImageUploadButton extends Component {
  static propTypes = {
    tab: React.PropTypes.object,
    onUpdate: React.PropTypes.func.isRequired
  }

  // we need to have global action in main_dev which is triggered when users clicks on + on images
  // this triggers invisible button in the toolbar
  static OpenUpload () {
    _imageUploadButton.openFileDialog(true)
  }

  componentDidMount () {
    _imageUploadButton = this
  }

  upload (e) {
    if (!e.target.files.length) {
      return
    }

    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onloadend = async () => {
      this.refs.file.value = ''
      // playground/workspaces extension needs to save the new version
      // so uploading of the new image goes into it
      if (Studio.workspaces) {
        await Studio.workspaces.save()
      }

      if (this.forNew) {
        const response = await Studio.api.post('/api/image', {
          attach: { filename: 'file.png', file: file }
        })

        const entity = {
          __entitySet: 'images',
          _id: response._id,
          name: response.name,
          shortid: response.shortid
        }

        Studio.addExistingEntity(entity)
        Studio.openTab(Object.assign({}, entity))
      } else {
        await Studio.api.post(`/api/image/${this.props.tab.entity.shortid}`, {
          attach: { filename: 'file.png', file: file }
        })

        Studio.loadEntity(this.props.tab.entity._id, true)
      }
    }

    reader.onerror = function () {
      alert('There was an error reading the file!')
    }

    reader.readAsBinaryString(file)
  }

  openFileDialog (forNew) {
    this.forNew = forNew

    this.refs.file.dispatchEvent(new MouseEvent('click', {
      'view': window,
      'bubbles': false,
      'cancelable': true
    }))
  }

  renderUpload () {
    return <input type='file' key='file' ref='file' style={{display: 'none'}} onChange={(e) => this.upload(e)} accept='image/*' />
  }

  render () {
    if (!this.props.tab || !this.props.tab.entity || this.props.tab.entity.__entitySet !== 'images') {
      return this.renderUpload(true)
    }

    return <div className='toolbar-button' onClick={() => { this.openFileDialog() }}>
      <i className='fa fa-cloud-upload' />Upload
      {this.renderUpload()}
    </div>
  }
}

