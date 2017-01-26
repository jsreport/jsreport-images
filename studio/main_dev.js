import ImageEditor from './ImageEditor.js'
import ImageUploadButton from './ImageUploadButton.js'
import Studio from 'jsreport-studio'

Studio.addEntitySet({
  name: 'images',
  faIcon: 'fa-camera',
  visibleName: 'image',
  onNew: ImageUploadButton.OpenUpload,
  helpUrl: 'http://jsreport.net/learn/images',
  entityTreePosition: 600
})

Studio.addEditorComponent('images', ImageEditor)
Studio.addToolbarComponent(ImageUploadButton)
