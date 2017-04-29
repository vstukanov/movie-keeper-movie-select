import React from 'react'
import {render} from 'react-dom'

import Component from '../../src/MovieSelect'

let Demo = React.createClass({
  render() {
    return <div>
      <h1>movie-keeper-movie-select Demo</h1>
      <Component/>
    </div>
  }
})

render(<Demo/>, document.querySelector('#demo'))
