import React from 'react'
// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'
// import * as actions from '@actions'

import { NavLink } from 'react-router-dom'

import { Nav } from '@alifd/next'

import Logo  from './Logo'
import Login from './Login'
import navs from '@src/navs'

const { Item } = Nav

export default class Navbar extends React.Component {
	constructor(props) {
		super(props)
	}
	componentWillMount () {
	}
	render() {
		let { route = 'home' } = this.props
		return (
			<Nav className="basic-nav" direction="hoz" type="primary" header={Logo} footer={Login} selectedKeys={route} selectedKeys={route} triggerType="hover">
				{
					navs.map(({ name, path }) => {
						return (
							<Item key={name}>
								<NavLink to={path}>{name}</NavLink>
							</Item>
						)
					})
				}
			</Nav>
		)
	}
}


// Navbar.defaultProps = {
// }

// const mapStateToProps = state => state

// const mapDispatchToProps = dispatch => ({
// 	actions: bindActionCreators(actions, dispatch)
// })

// export default connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )(Navbar)