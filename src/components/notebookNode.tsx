import * as React from 'react';

import {ExpandableNodeRenderStrategy} from './treeView/expandableNodeRenderStrategy';
import {ExpandableNode} from './treeView/expandableNode';
import {Notebook} from '../oneNoteDataStructures/notebook';
import {SectionNode} from './sectionNode';
import {SectionGroupNode} from './sectionGroupNode';
import {OneNoteItemUtils} from '../oneNoteDataStructures/oneNoteItemUtils';

export class NotebookNode implements ExpandableNodeRenderStrategy {
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

	getId(): string {
		return this.notebook.id;
	}

	getChildren(): JSX.Element[] {
		let sectionGroupRenderStrategies: ExpandableNodeRenderStrategy[] = this.notebook.sectionGroups.map(sectionGroup => new SectionGroupNode(sectionGroup, this.globals));
		let sectionGroups = sectionGroupRenderStrategies.map(renderStrategy =>
			<ExpandableNode
				expanded={renderStrategy.isExpanded()} node={renderStrategy}
				treeViewId={'oneNotePicker'} key={renderStrategy.getId()}
				id={renderStrategy.getId()}></ExpandableNode>);

		let sectionRenderStrategies: ExpandableNodeRenderStrategy[] = this.notebook.sections.map(section => new SectionNode(section, this.globals));
		let sections = sectionRenderStrategies.map(section =>
			<ExpandableNode
				expanded={section.isExpanded()} node={section}
				treeViewId={'oneNotePicker'} key={section.getId()}
				id={section.getId()}></ExpandableNode>);

		return sectionGroups.concat(sections);
	}

	isExpanded(): boolean {
		return this.notebook.expanded;
	}

	private isSelected(): boolean {
		return this.globals.selectedId === this.notebook.id;
	}
}
