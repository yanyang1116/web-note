declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.css'

/**
 * Without never? never 更加合适
 * Without 原本是这样的
 * type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
 *
 * 排除 P 类型中，和 U 相同的部分（大部分情况他们都是 extends Object 的类型表述）
 * 这并不代表，他们谁的范围大，范围小。仅仅 "排除 P 类型中，和 U 相同的部分"
 */
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: any }

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
	}

	type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U
}

// declare namespace NodeJS {
// 	interface ProcessEnv {
// 		DEPLOY_ENV: 'test' | 'pre' | 'prd'
// 		NODE_ENV: 'development' | 'production'
// 	}
// }

export {}
