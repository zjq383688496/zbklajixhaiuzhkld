Object.assign(window, {
	__baseData__: {
		route: '/'
	},
	__baseFun__: {

	},
	toRoute(url) {
		this.props.history.push(url)
	},
})