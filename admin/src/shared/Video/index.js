import React, { Component } from 'react'
// import Upload from '../Upload'
import { Button, Table } from '@alifd/next'

import './index.less'

const { Column: TableColumn } = Table

class Video extends Component {
	constructor(props) {
		super(props)
		
		let repos
		if (__isBrowser__) {
			if (window.__INITIAL_DATA__) {
				repos = window.__INITIAL_DATA__
				if (JSON.stringify(repos) === '{}') repos = []
				delete window.__INITIAL_DATA__
			} else {
				props.fetchInitialData().then(res => {
					repos = res
					this.setState({
						repos,
						loading: !repos,
					})
				})
			}
		} else {
			repos = this.props.staticContext.data
		}

		this.state = {
			repos,
			loading: !repos,
		}
	}
	componentDidMount() {}
	componentDidUpdate(prevProps, prevState) {}

	routeTo = url => {
		return e => {
			e.stopPropagation()
			this.props.history.push(url)
		}
	}

	render() {
		const { loading, repos = [] } = this.state

		if (loading) return <p>LOADING</p>

		console.log('repos: ', repos)

		return (
			<div>
				<Button type="primary" onClick={this.routeTo('/video/add')}>上传视频</Button>
				<br /><br />
				<Table dataSource={repos}>
					<TableColumn title="Id" dataIndex="id"/>
					<TableColumn title="Time" dataIndex="time"/>
				</Table>
			</div>
		)
	}
}

export default Video