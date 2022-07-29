// /**
//  *
//  */
// import React, { useCallback, useEffect } from 'react';

// // interface IProps<T = null> {
// // 	ref: React.MutableRefObject<T>;
// // 	containerRef: React.LegacyRef<T>;
// // }

// interface IProps {
// 	ref: any;
// 	containerRef: any;
// 	onDrag: Function;
// }

// export default function useDrag(props: IProps) {
// 	let startX = 0;
// 	let startY = 0;
// 	useEffect(() => {
// 		console.log(123123123)
// 		const currentRef = props.ref.current
// 		currentRef.onmousedown = function(e: any) {
// 			e = e || window.event;
// 			var start = 0, diff = 0;
// 			if( e.pageX) start = e.pageX;
// 			else if( e.clientX) start = e.clientX;

// 			currentRef.style.position = 'relative';
// 			document.body.onmousemove = function(e) {
// 				console.log(1231231)
// 				e = e || window.event;
// 				var end = 0;
// 				if( e.pageX) end = e.pageX;
// 				else if( e.clientX) end = e.clientX;

// 				diff = end-start;
// 				currentRef.style.left = diff+"px";
// 			};
// 			document.body.onmouseup = function() {
// 				// do something with the action here
// 				// props.ref has been moved by diff pixels in the X axis
// 				currentRef.style.position = 'static';
// 				document.body.onmousemove = document.body.onmouseup = null;
// 			};
// 		}
// 	}, [props.ref])

// 	const handleDragStart = useCallback(
// 		(e: any) => {
// 			// const xKey = Object.keys(e).filter((key) => {
// 			// 	if (key.includes('X') || key.includes('x')) {
// 			// 		return true;
// 			// 	}
// 			// });
// 			// startY = e.layerY
// 			// console.log(e.layerY, 123123);

// 			// xKey.forEach((item) => {
// 			// 	console.log(item, (e as unknown as any)[item]);
// 			// });

// 		},
// 		[props.ref, props.containerRef]
// 	);

// 	const handleDrag = useCallback(
// 		(e: any) => {
// 			// e.layerY = startY
// 			// console.log(e.layerX, 23);
// 			// const xKey = Object.keys(e).filter((key) => {
// 			// 	if (key.includes('X') || key.includes('x')) {
// 			// 		return true;
// 			// 	}
// 			// });
// 			// xKey.forEach((item) => {
// 			// 	console.log(item, (e as unknown as any)[item]);
// 			// });
// 			// console.log(321);
// 		},
// 		[props.ref, props.containerRef]
// 	);

// 	useEffect(() => {
// 		if (!props.ref.current || !props.containerRef.current) return;
// 		// console.log(props.ref, props.containerRef);
// 		// console.log(props.containerRef.current.clientWidth);
// 		props.ref.current.addEventListener('dragstart', handleDragStart);
// 		props.ref.current.addEventListener('drag', handleDrag);

// 	}, [props.ref, props.containerRef]);

// 	// const width = props.width
// 	// const domRef = props.domRef
// 	// const
// 	// useEffect(() => {

// 	// 	domRef.addEventListener('touchStart', domRef)
// 	// })
// 	// return width
// }
