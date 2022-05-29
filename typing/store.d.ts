// import state from '@view/store/state';
// import * as actionCollection from '@view/store/action/index';
// import { syncReducer } from '@view/store/reducer';

// export type StateKeyCollection = keyof typeof state;

// export type SyncAction<T> = {
// 	payload: T;
// 	key: StateKeyCollection;
// 	type: 'sync'; // 只约定这一种类型，扩展应该意义不大
// };

// export type SyncReducerCollection = XOR<
// 	{},
// 	Record<StateKeyCollection, typeof syncReducer>
// >;
// export type AsyncActionCollection = Exclude<
// 	keyof typeof actionCollection,
// 	'sync'
// >;

// export type SyncActionFn = (key: StateKeyCollection, payload: any) => void;
// export type AsyncActionFn = (
// 	actionKey: AsyncActionCollection,
// 	params?: any
// ) => Promise<any>;
// export type MapDispatchToPropsReturn = {
// 	syncAction: SyncActionFn;
// 	asyncAction: AsyncActionFn;
// };
// export type DispatchFn = (
// 	dispatch: Dispatch,
// 	getState: () => void
// ) => Promise<any>;
// export type Dispatch = (
// 	action: XOR<SyncAction<any>, DispatchFn>
// ) => XOR<void, Promise<any>>;

// export type ReduxProps = typeof state & {
// 	syncAction: (key: StateKeyCollection, payload?: any) => void;
// 	asyncAction: (key: AsyncActionCollection, params?: any) => Promise<any>;
// 	dispatch: (action: () => SyncAction<any>) => void;
// };
