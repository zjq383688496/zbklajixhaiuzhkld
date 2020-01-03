import React, { Component } from 'react'
import { Button, Table } from '@alifd/next'
import { videoUpload } from '@service/video'

class Upload extends Component {
	constructor(props) {
		super(props)
	}
	componentDidMount () {
	}
	componentDidUpdate () {
	}
	fileChange = ({ target }) => {
		const { files: [ file ] } = target
		videoUpload(file).then(res => {
			console.log(res)
			target.value = ''
		}).catch(e => {
			target.value = ''
		})
	}
	render() {
		return (
			<input type="file" accept={'.mp4'} onChange={this.fileChange} />
		)
	}
}

export default Upload