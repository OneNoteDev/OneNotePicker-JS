import * as React from 'react';

import {RenderableExpandableNode} from './treeView/renderableNode';
import {LeafNode} from './treeView/leafNode';
import {Section} from '../oneNoteDataStructures/section';
import {PageNode} from './pageNode';
import {OneNoteItemUtils} from '../oneNoteDataStructures/oneNoteItemUtils';

export class SectionNode implements RenderableExpandableNode {
	// TODO strong typing for globals
	constructor(private section: Section, private globals) { }
	
	element(): JSX.Element {
		let isSelected = this.isSelected();

		return (
			<div aria-selected={isSelected} className={isSelected ? 'picker-selectedItem' : ''}>
				<div className='picker-icon-left'>
					<img src={require('../images/section_icon.png')}/>
				</div>
				<div>
					<label className='ms-fontSize-sPlus'>{this.section.name}</label>
				</div>
			</div>);
	}

	onClick() {
		let onSectionSelected = this.globals.callbacks.onSectionSelected;
		if (!!onSectionSelected) {
			onSectionSelected(this.section, OneNoteItemUtils.getAncestry(this.section));
		}
	}
	
	isExpanded(): boolean {
		return this.section.expanded;
	}

	getKey(): string {
		return this.section.id;
	}

	getChildren(): JSX.Element[] {
		let pageNodes: PageNode[] | undefined = this.section.pages && this.section.pages.map(page => new PageNode(page, this.globals));
		let pages = pageNodes && pageNodes.map(page => <LeafNode
			treeViewId='oneNotePicker' node={page}
			id={page.getKey()}></LeafNode>);

		return pages || [] as JSX.Element[];
	}

	private isSelected(): boolean {
		return this.globals.selectedId === this.section.id;
	}
}
