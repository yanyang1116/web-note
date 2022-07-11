import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Document from '@tiptap/extension-document';
import Placeholder from '@tiptap/extension-placeholder';

import '../../assets/md-theme/default/index.scss';
import styles from './index.module.scss';
import SideBar from '../../components/SideBar/index';

export default function Index() {
	const editor = useEditor({
		extensions: [Highlight, StarterKit, Typography],
		content: 'input ...',
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
