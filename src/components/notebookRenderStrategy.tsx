import * as React from 'react';

import {SectionRenderStrategy} from './sectionRenderStrategy';
import {SectionGroupRenderStrategy} from './sectionGroupRenderStrategy';
import {ExpandableNodeRenderStrategy} from './treeView/expandableNodeRenderStrategy';
import {ExpandableNode} from './treeView/expandableNode';
import {LeafNode} from './treeView/leafNode';
import {Constants} from '../constants';
import {Notebook} from '../oneNoteDataStructures/notebook';
import {OneNoteItemUtils} from '../oneNoteDataStructures/oneNoteItemUtils';
import {InnerGlobals} from '../props/globalProps';

export class NotebookRenderStrategy implements ExpandableNodeRenderStrategy {
	onClickBinded = this.onClick.bind(this);

	constructor(private notebook: Notebook, private globals: InnerGlobals) { }
	
	element(): JSX.Element {
		let isSelected = this.isSelected();

		return (
			<div aria-selected={isSelected} className={isSelected ? 'picker-selectedItem' : ''} title={this.notebook.name}>
				<div className='picker-icon-left'>
					<img src={require('../images/notebook_icon.png')}/>
				</div>
				<div>
					<label className='ms-fontSize-sPlus'>{this.notebook.name}</label>
				</div>
			</div>);
	}

	getId(): string {
		return this.notebook.id;
	}

	getChildren(): JSX.Element[] {
		let sectionGroupRenderStrategies = this.notebook.sectionGroups.map(sectionGroup => new SectionGroupRenderStrategy(sectionGroup, this.globals));
		let sectionGroups = sectionGroupRenderStrategies.map(renderStrategy =>
			!!this.globals.callbacks.onSectionSelected || !!this.globals.callbacks.onPageSelected ?
				<ExpandableNode	expanded={renderStrategy.isExpanded()} node={renderStrategy}
					treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
					id={renderStrategy.getId()}></ExpandableNode> :
				<LeafNode node={renderStrategy} treeViewId={Constants.TreeView.id} key={renderStrategy.getId()} id={renderStrategy.getId()}></LeafNode>);

		let sectionRenderStrategies = this.notebook.sections.map(section => new SectionRenderStrategy(section, this.globals));
		let sections = sectionRenderStrategies.map(renderStrategy =>
			!!this.globals.callbacks.onPageSelected ?
				<ExpandableNode
					expanded={renderStrategy.isExpanded()} node={renderStrategy}
					treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
					id={renderStrategy.getId()}></ExpandableNode> :
				<LeafNode node={renderStrategy} treeViewId={Constants.TreeView.id} key={renderStrategy.getId()} id={renderStrategy.getId()}></LeafNode>);

		return sectionGroups.concat(sections);
	}

	isExpanded(): boolean {
		return this.notebook.expanded;
	}

	private isSelected(): boolean {
		return this.globals.selectedId === this.notebook.id;
	}

	private onClick() {
		let onNotebookSelected = this.globals.callbacks.onNotebookSelected;
		if (!!onNotebookSelected) {
			onNotebookSelected(this.notebook, OneNoteItemUtils.getAncestry(this.notebook));
		}
	}
}
