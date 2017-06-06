import * as React from 'react';

import {SectionRenderStrategy} from './sectionRenderStrategy';
import {SectionGroupRenderStrategy} from './sectionGroupRenderStrategy';
import {ExpandableNodeRenderStrategy} from './treeView/expandableNodeRenderStrategy';
import {ExpandableNode} from './treeView/expandableNode';
import {Constants} from '../constants';
import {Notebook} from '../oneNoteDataStructures/notebook';
import {OneNoteItemUtils} from '../oneNoteDataStructures/oneNoteItemUtils';
import {InnerGlobals} from '../props/globalProps';

export class NotebookRenderStrategy implements ExpandableNodeRenderStrategy {
	constructor(private notebook: Notebook, private globals: InnerGlobals) { }
	
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
		let sectionGroupRenderStrategies: ExpandableNodeRenderStrategy[] =
			this.notebook.sectionGroups.map(sectionGroup => new SectionGroupRenderStrategy(sectionGroup, this.globals));
		let sectionGroups = sectionGroupRenderStrategies.map(renderStrategy =>
			<ExpandableNode
				expanded={renderStrategy.isExpanded()} node={renderStrategy}
				treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
				id={renderStrategy.getId()}></ExpandableNode>);

		let sectionRenderStrategies: ExpandableNodeRenderStrategy[] =
			this.notebook.sections.map(section => new SectionRenderStrategy(section, this.globals));
		let sections = sectionRenderStrategies.map(section =>
			<ExpandableNode
				expanded={section.isExpanded()} node={section}
				treeViewId={Constants.TreeView.id} key={section.getId()}
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
