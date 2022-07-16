// declare module '*.png';
// declare module '*.jpg';
// declare module '*.jpeg';

declare global {
	interface Window {}

	namespace NodeJS {
		interface ProcessEnv {
			DEPLOY_ENV: 'dev' | 'prd';
			NODE_ENV: 'development' | 'production';
			PUBLIC_URL?: string;
		}
	}
}

// 告诉编译器，这是一个模块声明文件，而不是简单的全局申明文件
export {};
