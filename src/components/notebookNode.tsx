import * as React from 'react';

import {RenderableExpandableNode} from './treeView/renderableNode';
import {Notebook} from '../oneNoteDataStructures/notebook';
import {SectionItem} from './sectionItem';
import {SectionGroupItem} from './sectionGroupItem';
import {OneNoteItemUtils} from '../oneNoteDataStructures/oneNoteItemUtils';

export class NotebookNode implements RenderableExpandableNode {
	// TODO strong typing for globals
	constructor(private notebook: Notebook, private globals) { }
	
	element(): JSX.Element {
		let isSelected = this.isSelected();

		return (
			<div aria-selected={isSelected} className={isSelected ? 'picker-selectedItem' : ''}>
				<div className='picker-icon-left'>
					<img src={require('../images/notebook_icon.png')}/>
				</div>
				<div>
					<label className='ms-fontSize-sPlus'>{this.notebook.name}</label>
				</div>
			</div>);
	}

	onClick() {
		let onNotebookSelected = this.globals.callbacks.onNotebookSelected;
		if (!!onNotebookSelected) {
			onNotebookSelected(this.notebook, OneNoteItemUtils.getAncestry(this.notebook));
		}
	}
	
	isExpanded(): boolean {
		return this.notebook.expanded;
	}

	getKey(): string {
		return this.notebook.id;
	}

	getName(): string {
		return this.notebook.name;
	}

	private isSelected(): boolean {
		return this.globals.selectedId === this.notebook.id;
	}

	getChildren(): JSX.Element[] {
		let sectionGroups = this.notebook.sectionGroups.map(sectionGroup =>
			<SectionGroupItem
				globals={this.globals} sectionGroup={sectionGroup}
				key={sectionGroup.name}></SectionGroupItem>);

		let sections = this.notebook.sections.map(section =>
			<SectionItem globals={this.globals}
				section={section}
				key={section.name}></SectionItem>);

		return sectionGroups.concat(sections);
	}
}
