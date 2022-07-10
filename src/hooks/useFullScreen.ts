// const fullScreenFn = useMemo(
// 	() => () => {
// 		document.fullscreen
// 			? document.exitFullscreen()
// 			: document.documentElement.requestFullscreen();
// 	},
// 	[]
// );
// useLayoutEffect(() => {
// 	document.documentElement.addEventListener('dblclick', fullScreenFn);
// 	return () =>
// 		document.documentElement.removeEventListener(
// 			'dblclick',
// 			fullScreenFn
// 		);
// }, []);
