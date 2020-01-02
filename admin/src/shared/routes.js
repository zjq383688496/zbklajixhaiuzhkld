import Home from './Home'
import Video from './Video'
import { videoList } from './api'

const routes =  [
	{
		name: 'home',
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
		name: 'video',
		path: '/video',
		component: Video,
		fetchInitialData: () => videoList()
	}
]

export default routes