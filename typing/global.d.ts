type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: any };

declare type XOR<T, U> = T | U extends object
	? (Without<T, U> & U) | (Without<U, T> & T)
	: T | U;
