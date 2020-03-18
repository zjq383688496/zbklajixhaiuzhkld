import React from 'react'
import { Switch, Route } from 'react-router-dom'
import FetchInit from '@comp/FetchInit'
import Navbar    from '@comp/Navbar'
import NoMatch   from '@page/NoMatch'

import '@utils'
import '@alifd/next/dist/next.css'
import '@assets/common.less'

import { Shell } from '@alifd/next'
import routes from './routes'

const {
	Content: ShellContent,
	Footer:  ShellFooter,
} = Shell

export default class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			route: ''
		}
	}

	componentWillMount() {
		Object.defineProperty(window.__baseData__, 'route', {
			set: route => {
				if (this.state.route === route) return
				this.setState({ route })
			}
		})
	}
	render() {
		return [
			<Navbar key={0} route={this.state.route} />,
			<Shell key={2} style={{border: '1px solid #eee'}}>
				<ShellContent>
					<Switch>
						{
							routes.map(({ name, path, exact, component, fetchInitialData, ...rest }) => (
								<Route key={path} path={path} exact={exact} render={props => <FetchInit fetchInitialData={fetchInitialData} component={component} props={props} {...rest} />} />
							))
						}
						<Route render={props => <NoMatch {...props} /> } />
					</Switch>
				</ShellContent>

				<ShellFooter>
					<span>@ 2020 庄家琪 版权所有</span>
				</ShellFooter>
			</Shell>
		]
	}
}