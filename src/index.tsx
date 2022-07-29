import * as ReactDOMClient from 'react-dom/client';
import App from './app';
import 'normalize.css';
import './assets/global.scss';
import { Provider } from 'react-redux'

ReactDOMClient.createRoot(
	document.getElementById('root') as HTMLElement
).render();



<Provider store={store}>
	<App />
</Provider>
