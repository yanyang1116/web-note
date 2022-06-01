import React from 'react';
// import { Provider } from 'react-redux';
import {
	Route,
	unstable_HistoryRouter as HistoryRouter,
} from 'react-router-dom';
import { createBrowserHistory } from 'history';

// import store from './store/index';

const a: webpack;

// process.env.
// const a: XOR<string, number>

import '@view/assets/global.less';
import routerConfig from './views/index';
const history = createBrowserHistory({ window });

export default function App() {
	return (
		// <Provider store={store}>
		<HistoryRouter history={history}>
			{routerConfig.map((item) => (
				<Route path={item.path} element={item.element} />
			))}
		</HistoryRouter>
		// </Provider>
	);
}
