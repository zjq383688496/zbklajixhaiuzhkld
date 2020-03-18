import React from 'react'
import { Loading } from '@alifd/next'

export default class FetchInit extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true
		}
	}
	componentWillMount() {
		this.setMain()
		this.fetchInit()
	}
	setMain = () => {
		let { path } = this.props.props.match
		let main = path.split('/')[1] || 'home'
		__baseData__.route = main
	}
	fetchInit = () => {
		let { fetchInitialData, props } = this.props,
			{ params = {} } = props.match
		if (fetchInitialData) {
			fetchInitialData(params).then(initData => {
				this.setState({ initData, loading: false })
			})
		} else {
			this.setState({ loading: false })
		}
	}
	render() {
		let { component: Component, props } = this.props
		let { initData, loading } = this.state
		return (
			<Loading visible={loading} shape="fusion-reactor">
				{
					!loading
					?
					<Component { ...props } initData={initData} />
					: null
				}
            </Loading>
		)
	}
}