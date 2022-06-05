import * as ReactDOMClient from 'react-dom/client';
import App from './app';

ReactDOMClient.createRoot(
	document.getElementById('root') as HTMLElement
).render(<App />);
