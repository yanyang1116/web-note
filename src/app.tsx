import React, { useState } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import store from './store/index'
import Test from './test'

import '@view/assets/global.css'
// import AppRouter from './router/index'

const appHistory = createBrowserHistory()

export default function App() {
	return (
		<Provider store={store}>
			<Router history={appHistory}>
				{/* <AppRouter {...appHistory} /> */}
				<Test />
			</Router>
		</Provider>
	)
}
