import React, { useCallback, useEffect } from 'react';

// interface IProps<T = null> {
// 	ref: React.MutableRefObject<T>;
// 	containerRef: React.LegacyRef<T>;
// }

interface IProps {
	ref: any;
	containerRef: any;
	onDrag: Function;
}

export default function useDrag(props: IProps) {
	let startX = 0;
	const handleDragStart = useCallback(
		(e: any) => {
			// const xKey = Object.keys(e).filter((key) => {
			// 	if (key.includes('X') || key.includes('x')) {
			// 		return true;
			// 	}
			// });
			console.log(e.layerX);
			// xKey.forEach((item) => {
			// 	console.log(item, (e as unknown as any)[item]);
			// });
		},
		[props.ref, props.containerRef]
	);

	const handleDrag = useCallback(
		(e: any) => {
			console.log(e.layerX, 23);
			// const xKey = Object.keys(e).filter((key) => {
			// 	if (key.includes('X') || key.includes('x')) {
			// 		return true;
			// 	}
			// });
			// xKey.forEach((item) => {
			// 	console.log(item, (e as unknown as any)[item]);
			// });
			// console.log(321);
		},
		[props.ref, props.containerRef]
	);

	useEffect(() => {
		if (!props.ref.current || !props.containerRef.current) return;
		console.log(123123);
		// console.log(props.ref, props.containerRef);
		// console.log(props.containerRef.current.clientWidth);
		props.ref.current.addEventListener('dragstart', handleDragStart);
		props.ref.current.addEventListener('drag', handleDrag);
	}, [props.ref, props.containerRef]);

	// const width = props.width
	// const domRef = props.domRef
	// const
	// useEffect(() => {

	// 	domRef.addEventListener('touchStart', domRef)
	// })
	// return width
}
