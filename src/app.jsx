import React, { useCallback, useMemo, useState } from 'react';
import styles from './assets/global.scss';
import A from './assets/800webp.webp';
// import { Provider } from 'react-redux';
// import {
// 	Route,
// 	unstable_HistoryRouter as HistoryRouter,
// } from 'react-router-dom';
// import { createBrowserHistory } from 'history';

// import store from './store/index';
// process.env.
// const a: XOR<string, number>

// import '@view/assets/global.less';
// import routerConfig from './views/index';
// const history = createBrowserHistory({ window });

export default function App() {
	const [count, setCount] = useState(1);

	const handleClick = useCallback(() => {
		setCount(count + 1);
	}, [count]);

	return (
		<div>
			<div onClick={handleClick}>点击啊</div>
			<div onClick={handleClick}>{process.env.DEPLOY_ENV}</div>
			<div>{count}</div>
			<img src={A} />
			<div className="a"></div>
		</div>
		// <Provider store={store}>
		// <HistoryRouter history={history}>
		// 	{routerConfig.map((item) => (
		// 		<Route path={item.path} element={item.element} />
		// 	))}
		// </HistoryRouter>
		// </Provider>
	);
}
