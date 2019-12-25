import Home from './Home'
// import Grid from './Grid'
import List from './List'
import { videoList } from './api'

const routes =  [
	{
		path: '/',
		exact: true,
		component: Home,
	},
	// {
	// 	path: '/:id',
	// 	component: Grid,
	// 	fetchInitialData: (path = '') => fetchPopularRepos(path)
	// }
	{
		path: '/videos',
		component: List,
		fetchInitialData: (path = '') => videoList()
	}
]

export default routes