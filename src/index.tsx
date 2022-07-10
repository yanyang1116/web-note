import * as ReactDOMClient from 'react-dom/client';
import App from './app';
import 'normalize.css';
import './assets/global.scss';

ReactDOMClient.createRoot(
	document.getElementById('root') as HTMLElement
).render(<App />);
