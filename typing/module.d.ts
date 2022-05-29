declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.css';

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
	}
}

declare namespace NodeJS {
	interface ProcessEnv {
		DEPLOY_ENV: 'dev' | 'prd';
		NODE_ENV: 'development' | 'production';
	}
}

// 告诉编译器，这是一个模块声明文件，而不是简单的全局申明文件
export {};
