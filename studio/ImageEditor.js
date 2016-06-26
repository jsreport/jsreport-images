import React, { Component } from 'react'

export default class ImageEditor extends Component {
  static propTypes = {
    entity: React.PropTypes.object.isRequired
  }

  render () {
    const { entity } = this.props

    return (<div className='custom-editor'>
      <div><h1><i className='fa fa-camera' /> {entity.name}</h1></div>
      <div>
        <div>Embed into a html based template using data uri scheme:
          <code>
            <h2 style={{textTransform: 'none'}}>
              &lt;img src='{'{#image ' + entity.name + "}'"}/&gt;
            </h2>
          </code>
        </div>
      </div>
      <div>
        <div>Embed using raw base64 encoding:
          <code>
            <h2 style={{textTransform: 'none'}}>
              {'{#image ' + entity.name + ' @encoding=base64}'}
            </h2>
          </code>
        </div>
      </div>

      <div style={{overflow: 'auto'}}>
        <img src={'data:' + entity.contentType + ';base64,' + entity.content} style={{display: 'block', margin: '3rem auto'}} />
      </div>
    </div>)
  }
}

