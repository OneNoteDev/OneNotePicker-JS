import * as React from 'react';

import {SectionRenderStrategy} from './sectionRenderStrategy';
import {ExpandableNodeRenderStrategy} from './treeView/expandableNodeRenderStrategy';
import {ExpandableNode} from './treeView/expandableNode';
import {LeafNode} from './treeView/leafNode';
import {Constants} from '../constants';
import {SectionGroup} from '../oneNoteDataStructures/sectionGroup';
import {InnerGlobals} from '../props/globalProps';

export class SectionGroupRenderStrategy implements ExpandableNodeRenderStrategy {
	onClickBinded = this.onClick.bind(this);

	constructor(private sectionGroup: SectionGroup, private globals: InnerGlobals) { }
	
	element(): JSX.Element {
		return (
			<div>
				<div className='picker-icon-left'>
					<img src={require('../images/sectiongroup_icon.png')}/>
				</div>
				<div>
					<label className='ms-fontSize-sPlus'>{this.sectionGroup.name}</label>
				</div>
			</div>);
	}

	getId(): string {
		return this.sectionGroup.id;
	}

	getChildren(): JSX.Element[] {
		let sectionGroupNodes: ExpandableNodeRenderStrategy[] =
			this.sectionGroup.sectionGroups.map(sectionGroup => new SectionGroupRenderStrategy(sectionGroup, this.globals));
		let sectionGroups = sectionGroupNodes.map(renderStrategy =>
			!!this.globals.callbacks.onSectionSelected || !!this.globals.callbacks.onPageSelected ?
				<ExpandableNode expanded={renderStrategy.isExpanded()} node={renderStrategy}
					treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
					id={renderStrategy.getId()}></ExpandableNode> :
				<LeafNode node={renderStrategy} treeViewId={Constants.TreeView.id} key={renderStrategy.getId()} id={renderStrategy.getId()}></LeafNode>);

		let sectionNodes: ExpandableNodeRenderStrategy[] =
			this.sectionGroup.sections.map(section => new SectionRenderStrategy(section, this.globals));
		let sections = sectionNodes.map(renderStrategy =>
			!!this.globals.callbacks.onPageSelected ?
				<ExpandableNode expanded={renderStrategy.isExpanded()} node={renderStrategy}
					treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
					id={renderStrategy.getId()}></ExpandableNode> :
				<LeafNode node={renderStrategy} treeViewId={Constants.TreeView.id} key={renderStrategy.getId()} id={renderStrategy.getId()}></LeafNode>);

		return sectionGroups.concat(sections);
	}

	isExpanded(): boolean {
		return this.sectionGroup.expanded;
	}

	private onClick() {
		// No additional functionality
	}
}
