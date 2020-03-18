import Home  from '@page/Home'
import Video from '@page/Video'
// import { videoList } from '@service/video'

const routes =  [
	{
		name: 'home',
		path: '/',
	},
	{
		name: 'video',
		path: '/video',
		// fetchInitialData: () => videoList()
	},
]

export default routes