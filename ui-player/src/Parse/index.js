import React, { Component } from 'react'
import Mp4parse from '@/utils/mp4info'

export default class Parse extends Component {
	constructor(props) {
		super(props)

		this.state = {
		}
	}
	componentWillMount() {}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	handleChange = ({ target }) => {
		let [ file ] = target.files
		let r = new FileReader()
		// debugger
		// let blob = file.slice(0, file.size)
		r.onload = this.dataLoad
		r.readAsArrayBuffer(file)
	}

	dataLoad = ({ target }) => {
		let { result } = target
		let mp4 = new Mp4parse(result)
		console.log(mp4)
		// let newMP4 = JSON.parse(JSON.stringify(mp4))
		// delete newMP4.stream
		// console.log(newMP4)
	}

	render() {
		return (
			<div className="ui-parse">
				<input type="file" onChange={this.handleChange} />
			</div>
		)
	}
}
