import { ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';
import Loadable from 'react-loadable';

const router: RouteObject[] = [
	{
		path: '/',
		element: Loadable({
			loader: () =>
				import(/* webpackChunkName: "index" */ './index/index'),
			loading: () => <span>加载中...</span>,
		}) as unknown as ReactNode,
	},
];

export default router;
