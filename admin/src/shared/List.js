import React, { Component } from 'react'
import Upload from './Upload'
import { Button, Table } from '@alifd/next'

class List extends Component {
	constructor(props) {
		super(props)

		let repos
		if (__isBrowser__) {
			repos = window.__INITIAL_DATA__
			delete window.__INITIAL_DATA__
		} else {
			repos = this.props.staticContext.data
		}

		this.state = {
			repos,
			loading: !repos,
		}
	}
	componentDidMount () {
	}
	componentDidUpdate (prevProps, prevState) {
	}
	render() {
		const { loading, repos } = this.state

		return (
			<Upload />
		)
		if (loading) return <p>LOADING</p>

		return (
			<ul style={{display: 'flex', flexWrap: 'wrap'}}>
				{repos.map(({ name, owner, stargazers_count, html_url }) => (
					<li key={name} style={{margin: 30}}>
						<ul>
							<li><a href={html_url}>{name}</a></li>
							<li>@{owner.login}</li>
							<li>{stargazers_count} stars</li>
						</ul>
					</li>
				))}
			</ul>
		)
	}
}

export default List