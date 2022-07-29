import React, {
	forwardRef,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

import styles from './index.module.scss';
// import useDrag from './useDrag';

import { ReactComponent as IconNew } from '../../assets/icon-new.svg';
import { ReactComponent as IconAll } from '../../assets/icon-all.svg';
import { ReactComponent as IconTrash } from '../../assets/icon-trash.svg';
import { ReactComponent as IconDoc } from '../../assets/icon-doc.svg';

export default function SideBar() {
	const [newIconClassName, setNewIconClassName] = useState(
		`${styles.newWrapper}`
	);
	const [menuInfo, setMenuInfo] = useState([
		{
			name: '全部',
			selected: false,
			className: `${styles.totalWrapper}`,
			path: '',
			icon: IconAll,
		},
		{
			name: '垃圾箱',
			selected: false,
			className: `${styles.trashWrapper}`,
			path: '',
			icon: IconTrash,
		},
	]);

	const [recentNotes, setRecentNotes] = useState([
		{
			title: 'asdfasdfasdf',
			id: 1,
			selected: false,
		},
		{
			title: 'e4323rew1324asdfasdfasfdasdf1234',
			id: 2,
			selected: false,
		},
		{
			title: 'vbsdfgtwert234',
			id: 3,
			selected: false,
		},
		{
			title: '2341asdf',
			id: 4,
			selected: false,
		},
		{
			title: 'srtqtr2345er',
			id: 5,
			selected: false,
		},
	]);

	function handleSelectRecentNote(reset: boolean): undefined;
	function handleSelectRecentNote(index: number): void;
	function handleSelectRecentNote(query: boolean | number) {
		if (typeof query === 'boolean' && query) {
			const _recentNotes = recentNotes.map((v) => {
				v.selected = false;
				return v;
			});
			setRecentNotes(_recentNotes);
			return;
		}

		const _recentNotes = recentNotes.map((v, i) => {
			if (query !== i) {
				v.selected = false;
			} else {
				// ...
				v.selected = true;
			}
			return v;
		});
		setRecentNotes(_recentNotes);
		handleSelectMenu(true);
	}

	function handleSelectMenu(reset: boolean): undefined;
	function handleSelectMenu(index: number): void;
	function handleSelectMenu(query: boolean | number) {
		if (typeof query === 'boolean' && query) {
			const _menuInfo = menuInfo.map((v) => {
				v.selected = false;
				return v;
			});
			setMenuInfo(_menuInfo);
			return;
		}
		const _menuInfo = menuInfo.map((v, i) => {
			if (query !== i) {
				v.selected = false;
			} else {
				// ...
				v.selected = true;
			}
			return v;
		});
		setMenuInfo(_menuInfo);
		handleSelectRecentNote(true);
	}

	const drapLineRef = useRef(null);
	const containerRef = useRef(null);

	const [width, setWidth] = useState('300px');

	// useDrag({
	// 	ref: drapLineRef,
	// 	containerRef: containerRef,
	// 	onDrag: handleDrag,
	// });

	return (
		<div className={styles.wrapper} ref={containerRef} style={{ width }}>
			<i className={styles.drapLine} ref={drapLineRef} draggable />
			<div className={styles.avatarWrapper}>
				<i />
				<p>hi, yy</p>
			</div>
			<div
				className={newIconClassName}
				onMouseOut={() =>
					setNewIconClassName(
						`${styles.newWrapper} ${styles.newWrapperReset}`
					)
				}
				onMouseOver={() =>
					setNewIconClassName(
						`${styles.newWrapper} ${styles.newWrapperAni}`
					)
				}
			>
				<IconNew />
			</div>
			<div className={styles.recentWrapper}>
				最近
				<ul>
					{recentNotes.map((item, index) => (
						<li
							key={item.id}
							onClick={() => handleSelectRecentNote(index)}
							className={item.selected ? styles.active : ''}
						>
							<IconDoc />
							<span>{item.title}</span>
						</li>
					))}
				</ul>
			</div>
			{menuInfo.map((item, index) => (
				<div
					key={item.className}
					className={
						item.selected
							? `${item.className} ${styles.active}`
							: item.className
					}
					onClick={() => handleSelectMenu(index)}
				>
					{React.createElement(item.icon)}
					{item.name}
				</div>
			))}
		</div>
	);
}
