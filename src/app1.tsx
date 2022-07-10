import React, { useLayoutEffect, useCallback, useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const MenuBar = ({ editor }: { editor: any }) => {
	if (!editor) {
		return null;
	}

	return (
		<>
			<button
				onClick={() => editor.chain().focus().toggleBold().run()}
				className={editor.isActive('bold') ? 'is-active' : ''}
			>
				bold
			</button>
			<button
				onClick={() => editor.chain().focus().toggleItalic().run()}
				className={editor.isActive('italic') ? 'is-active' : ''}
			>
				italic
			</button>
			<button
				onClick={() => editor.chain().focus().toggleCode().run()}
				className={editor.isActive('code') ? 'is-active' : ''}
			>
				code
			</button>
			<button
				onClick={() => editor.chain().focus().unsetAllMarks().run()}
			>
				clear marks
			</button>
			<button onClick={() => editor.chain().focus().clearNodes().run()}>
				clear nodes
			</button>
			<button
				onClick={() => editor.chain().focus().setParagraph().run()}
				className={editor.isActive('paragraph') ? 'is-active' : ''}
			>
				paragraph
			</button>
			<button
				onClick={() =>
					editor.chain().focus().toggleHeading({ level: 1 }).run()
				}
				className={
					editor.isActive('heading', { level: 1 }) ? 'is-active' : ''
				}
			>
				h1
			</button>
			<button
				onClick={() =>
					editor.chain().focus().toggleHeading({ level: 2 }).run()
				}
				className={
					editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
				}
			>
				h2
			</button>
			<button
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className={editor.isActive('bulletList') ? 'is-active' : ''}
			>
				bullet list
			</button>
			<button
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				className={editor.isActive('orderedList') ? 'is-active' : ''}
			>
				ordered list
			</button>
			<button
				onClick={() => editor.chain().focus().toggleCodeBlock().run()}
				className={editor.isActive('codeBlock') ? 'is-active' : ''}
			>
				code block
			</button>
			<button
				onClick={() => editor.chain().focus().toggleBlockquote().run()}
				className={editor.isActive('blockquote') ? 'is-active' : ''}
			>
				blockquote
			</button>
			<button
				onClick={() => editor.chain().focus().setHorizontalRule().run()}
			>
				horizontal rule
			</button>
			<button onClick={() => editor.chain().focus().setHardBreak().run()}>
				hard break
			</button>
			<button onClick={() => editor.chain().focus().undo().run()}>
				undo
			</button>
			<button onClick={() => editor.chain().focus().redo().run()}>
				redo
			</button>
		</>
	);
};

export default function App() {
	const fullScreenFn = useMemo(
		() => () => {
			document.fullscreen
				? document.exitFullscreen()
				: document.documentElement.requestFullscreen();
		},
		[]
	);
	useLayoutEffect(() => {
		document.documentElement.addEventListener('dblclick', fullScreenFn);
		return () =>
			document.documentElement.removeEventListener(
				'dblclick',
				fullScreenFn
			);
	}, []);

	const editor = useEditor({
		extensions: [StarterKit],
		content: '<p>Hello World!</p>',
	});

	return (
		<>
			<MenuBar editor={editor} />
			<EditorContent editor={editor} />
		</>
	);
}
