import React, { useState } from 'react';
// import { Provider } from 'react-redux';
import {
	Route,
	unstable_HistoryRouter as HistoryRouter,
} from 'react-router-dom';
import { createBrowserHistory } from 'history';

// import store from './store/index';
// import Test from './test'

// import '@view/assets/global.css'
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
