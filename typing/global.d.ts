declare module '*.svg';
declare module '*.webp';

/**
 * Trap for `*.scss.d.ts` files which are not generated yet.
 */
declare module '*.scss' {
	var classes: any;
	export = classes;
}

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: any };

declare type XOR<T, U> = T | U extends object
	? (Without<T, U> & U) | (Without<U, T> & T)
	: T | U;
