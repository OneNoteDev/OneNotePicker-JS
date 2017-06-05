import * as React from 'react';

import {RenderableExpandableNode} from './treeView/renderableNode';
import {ExpandableNode} from './treeView/expandableNode';
import {Notebook} from '../oneNoteDataStructures/notebook';
import {SectionNode} from './sectionNode';
import {SectionGroupNode} from './sectionGroupNode';
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

	getChildren(): JSX.Element[] {
		let sectionGroupNodes: SectionGroupNode[] = this.notebook.sectionGroups.map(sectionGroup => new SectionGroupNode(sectionGroup, this.globals));
		let sectionGroups = sectionGroupNodes.map(sectionGroup =>
			<ExpandableNode
				expanded={sectionGroup.isExpanded()} node={sectionGroup}
				treeViewId={'oneNotePicker'} key={sectionGroup.getKey()}></ExpandableNode>);

		let sectionNodes: SectionNode[] = this.notebook.sections.map(section => new SectionNode(section, this.globals));
		let sections = sectionNodes.map(section =>
			<ExpandableNode
				expanded={section.isExpanded()} node={section}
				treeViewId={'oneNotePicker'} key={section.getKey()}></ExpandableNode>);

		return sectionGroups.concat(sections);
	}

	private isSelected(): boolean {
		return this.globals.selectedId === this.notebook.id;
	}
}
