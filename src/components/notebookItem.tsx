import * as React from 'react';

import SectionItem from './sectionItem';
import SectionGroupItem from './sectionGroupItem';
import GlobalProps from '../props/globalProps';
import Notebook from '../oneNoteDataStructures/notebook';
import OneNoteItemUtils from '../oneNoteDataStructures/oneNoteItemUtils';

interface NotebookItemProps extends GlobalProps {
	notebook: Notebook;
}

interface NotebookItemState {
	expanded: boolean;
}

class NotebookItem extends React.Component<NotebookItemProps, NotebookItemState> {
	constructor(props) {
		super(props);
		this.state = { expanded: props.expanded };
	}

	private onClick() {
		let onNotebookSelected = this.props.globals.callbacks.onNotebookSelected;
		if (!!onNotebookSelected) {
			onNotebookSelected(this.props.notebook, OneNoteItemUtils.getAncestry(this.props.notebook));
		}

		// We are only interested in expanding if either sections/pages are deemed selectable
		if (this.isExpandable()) {
			this.setState({ expanded: !this.state.expanded });
		}
	}

	private isExpandable(): boolean {
		let callbacks = this.props.globals.callbacks;
		return !!callbacks.onSectionSelected || !!callbacks.onPageSelected;
	}

	private isSelected(): boolean {
		return this.props.globals.selectedId === this.props.notebook.id;
	}

	render() {
		let isSelected = this.isSelected();

		return (
			<li aria-selected={isSelected} aria-expanded={this.state.expanded} role='treeitem'>
				<a className={isSelected ? 'picker-selectedItem' : ''} onClick={this.onClick.bind(this)} tabIndex={0} href='#'>
					<div className='picker-icon-left'>
						<img src={require('../images/notebook_icon.png')}/>
					</div>
					<div>
						<label className='ms-fontSize-sPlus'>{this.props.notebook.name}</label>
					</div>
				</a>
				<ul role='group' className='picker-list-header' style={this.state.expanded ? { display: 'block' } : { display: 'none' }}>
					{this.props.notebook.sectionGroups.map(sectionGroup => <SectionGroupItem globals={this.props.globals} sectionGroup={sectionGroup} key={sectionGroup.name}></SectionGroupItem>)}
					{this.props.notebook.sections.map(section => <SectionItem globals={this.props.globals} section={section} key={section.name}></SectionItem>)}
				</ul>
			</li>
		);
	}
}

export default NotebookItem;
