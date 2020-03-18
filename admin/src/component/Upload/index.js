'use strict'

import React from 'react'
import { Button, Icon, Progress } from '@alifd/next'

import { video } from '@server'
// var API = Server.resource

export default class UploadFile extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			progress: 0,
		}
	}
	componentWillMount() {}

	end = () => {
		var { dom } = this.refs
		this.setState({ progress: 0 })
		if (dom) dom.value = ''
	}

	fileUpload = (file, cb) => {
		let { params } = this.props
		video.upload(file, { parentId: params.id }, this.handleProgress).then(data => {
			this.end()
			cb && cb(data)
		})
	}

	handleProgress = ({ loaded, total }) => {
		// var progress = Math.round((loaded / total) * 100)
		// this.setState({ progress })
	}

	handleChange = ({ target }) => {
		var { max, onResult } = this.props
		var [ file ] = target.files
		var { name, size } = file
		if (size > max) return onResult('文件过大')
		this.fileUpload(file, onResult)
	}

	render() {
		var { accept, max, text, children } = this.props
		var { progress } = this.state
		return (
			<div className="ae-upload">
				<Button>
					<Icon type="upload" />
					{ text }
					<input
						ref={'dom'}
						className="upload-input-hidden"
						type="file"
						accept={accept}
						onChange={this.handleChange}
					/>
				</Button>
				{ children }
				{
					progress
					? <div className="ae-progress"><Progress shape="circle" percent={progress} width={80} /></div>
					: null
				}
			</div>
		)
	}
}
