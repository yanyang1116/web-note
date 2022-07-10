import React, { useLayoutEffect, useCallback, useMemo, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import './assets/md-theme/default/index.scss';
import Document from '@tiptap/extension-document';
import Placeholder from '@tiptap/extension-placeholder';

import styles from './index.module.scss';
import SideBar from './components/SideBar/index';

const CustomDocument = Document.extend({
	content: 'paragraph block*',
});

export default function App() {
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

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				document: false,
			}),
			Highlight,
			Typography,
			CustomDocument,
			Placeholder.configure({
				placeholder: ({}) => {
					return 'input ...';
				},
			}),
		],
		content: '',
	});

	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<EditorContent editor={editor} />
			</div>
			<SideBar />
		</div>
	);
}
