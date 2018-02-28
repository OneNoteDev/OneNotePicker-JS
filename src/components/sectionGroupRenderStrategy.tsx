import * as React from 'react';

import { SectionRenderStrategy } from './sectionRenderStrategy';
import { ExpandableNodeRenderStrategy } from './treeView/expandableNodeRenderStrategy';
import { ExpandableNode } from './treeView/expandableNode';
import { LeafNode } from './treeView/leafNode';
import { Constants } from '../constants';
import { SectionGroup } from '../oneNoteDataStructures/sectionGroup';
import { InnerGlobals } from '../props/globalProps';
import { SectionGroupIconSvg } from './icons/sectionGroupIcon.svg';

export class SectionGroupRenderStrategy implements ExpandableNodeRenderStrategy {
	onClickBinded = this.onClick.bind(this);

	constructor(private sectionGroup: SectionGroup, private globals: InnerGlobals) { }
	
	element(): JSX.Element {
		return (
			<div className='section-group' title={this.sectionGroup.name}>
				<div className='picker-icon'>
					<SectionGroupIconSvg />
				</div>
				<div className='picker-label'>
					<label>{this.sectionGroup.name}</label>
				</div>
			</div>);
	}

	getName(): string {
		return this.sectionGroup.name;
	}

	getId(): string {
		return this.sectionGroup.id;
	}

	getChildren(childrenLevel: number): JSX.Element[] {
		let sectionGroupRenderStrategies = this.sectionGroup.sectionGroups.map(sectionGroup => new SectionGroupRenderStrategy(sectionGroup, this.globals));
		let sectionGroups = sectionGroupRenderStrategies.map(renderStrategy =>
			!!this.globals.callbacks.onSectionSelected || !!this.globals.callbacks.onPageSelected ?
				<ExpandableNode
					expanded={renderStrategy.isExpanded()} node={renderStrategy} globals={this.globals}
					treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
					id={renderStrategy.getId()} level={childrenLevel} ariaSelected={renderStrategy.isAriaSelected()} /> :
				<LeafNode node={renderStrategy} treeViewId={Constants.TreeView.id} key={renderStrategy.getId()} globals={this.globals}
					id={renderStrategy.getId()} level={childrenLevel} ariaSelected={renderStrategy.isAriaSelected()} />);

		let sectionRenderStrategies = this.sectionGroup.sections.map(section => new SectionRenderStrategy(section, this.globals));
		let sections = sectionRenderStrategies.map(renderStrategy =>
			!!this.globals.callbacks.onPageSelected ?
				<ExpandableNode expanded={renderStrategy.isExpanded()} node={renderStrategy} globals={this.globals}
					treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
					id={renderStrategy.getId()} level={childrenLevel} ariaSelected={renderStrategy.isAriaSelected()} /> :
				<LeafNode node={renderStrategy} treeViewId={Constants.TreeView.id} key={renderStrategy.getId()} globals={this.globals}
					id={renderStrategy.getId()} level={childrenLevel} ariaSelected={renderStrategy.isAriaSelected()} />);

		return sections.concat(sectionGroups);
	}

	isExpanded(): boolean {
		return this.sectionGroup.expanded;
	}

	isSelected(): boolean {
		return false;
	}

	isAriaSelected(): boolean {
		return this.globals.ariaSelectedId ? this.globals.ariaSelectedId === this.getId() : false;
	}

	private onClick() {
		// No additional functionality
	}
}
