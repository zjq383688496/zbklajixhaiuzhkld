const express = require('express')
const cors = require('cors')
const React = require('react')
const { renderToString } = require('react-dom/server')
const { StaticRouter, matchPath } = require('react-router-dom')
const serialize = require('serialize-javascript')
// import { renderToString } from 'react-dom/server'
// import { StaticRouter, matchPath } from 'react-router-dom'
// import serialize from 'serialize-javascript'
import App from '../shared/App'
import routes from '../shared/routes'

const app  = express()
const PORT = 4190

app.use(cors())
app.use(express.static('public'))

app.get('*', (req, res, next) => {
	const activeRoute = routes.find(route => matchPath(req.url, route)) || {}

	console.log('url: ', req.url)
	const promise = activeRoute.fetchInitialData? activeRoute.fetchInitialData(req.path): Promise.resolve()

	promise.then((data) => {
		const context = { data }

		const str = renderToString(
			<StaticRouter location={req.url} context={context}>
				<App />
			</StaticRouter>
		)
		res.send(`
			<!DOCTYPE html>
			<html>
				<head>
					<title>SSR with RR</title>
					<script src="/bundle.js" defer></script>
					<script>window.__INITIAL_DATA__ = ${serialize(data)}</script>
				</head>
				<body>
					<div id="app">${str}</div>
				</body>
			</html>
		`)
	}).catch(next)
})

app.listen(PORT, () => {
	console.log(`应用启动端口: ${PORT}`)
})