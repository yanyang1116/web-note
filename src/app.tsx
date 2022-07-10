import React from 'react';
import {
	Route,
	Routes,
	unstable_HistoryRouter as HistoryRouter,
} from 'react-router-dom';
import { createBrowserHistory } from 'history';

import routerConfig from './views/index';

const history = createBrowserHistory({ window });

export default function App() {
	return (
		<HistoryRouter history={history}>
			<Routes>
				{routerConfig.map((item) => (
					<Route
						key={item.path}
						path={item.path}
						element={React.createElement(
							item.element as unknown as React.FunctionComponent
						)}
					/>
				))}
			</Routes>
		</HistoryRouter>
	);
}
