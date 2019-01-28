import * as React from 'react';

import { SectionRenderStrategy } from './sectionRenderStrategy';
import { ExpandableNodeRenderStrategy } from './treeView/expandableNodeRenderStrategy';
import { ExpandableNode } from './treeView/expandableNode';
import { LeafNode } from './treeView/leafNode';
import { Constants } from '../constants';
import { SectionGroup } from '../oneNoteDataStructures/sectionGroup';
import { InnerGlobals } from '../props/globalProps';
import { SectionGroupIconSvg } from './icons/sectionGroupIcon.svg';
import { ChevronSvg } from './icons/chevron.svg';
import { CreateNewSectionNode } from './createNewSection/createNewSectionNode';

export class SectionGroupRenderStrategy implements ExpandableNodeRenderStrategy {
	onClickBinded = this.onClick.bind(this);

	constructor(private sectionGroup: SectionGroup, private globals: InnerGlobals) { }

	element(): JSX.Element {
		return (
			<div className='picker-item section-group' title={this.sectionGroup.name} onClick={this.onClick.bind(this)}>
				<div className={this.isExpanded() ? 'chevron-icon opened' : 'chevron-icon closed'} onClick={this.onClick.bind(this)}>
					<ChevronSvg />
				</div>
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
		const createNewSection = this.globals.callbacks.onSectionCreated || this.globals.shouldShowCreateEntityInputs ?
			[<CreateNewSectionNode
				key={this.sectionGroup.id + 'createnewsectionnode'}
				{...this.globals}
				parent={this.sectionGroup}
				parentIsNotebook={false}
				level={childrenLevel}
				focusOnMount={false}
				tabbable={false}>
			</CreateNewSectionNode>] :
			[];

		const setsize = this.sectionGroup.sections.length + this.sectionGroup.sectionGroups.length;

		const sectionGroupRenderStrategies = this.sectionGroup.sectionGroups.map(sectionGroup => new SectionGroupRenderStrategy(sectionGroup, this.globals));
		const sectionGroups = sectionGroupRenderStrategies.map((renderStrategy, i) =>
			!!this.globals.callbacks.onSectionSelected || !!this.globals.callbacks.onPageSelected ?
				<ExpandableNode
					expanded={renderStrategy.isExpanded()} node={renderStrategy} globals={this.globals}
					treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
					id={renderStrategy.getId()} level={childrenLevel} ariaSelected={renderStrategy.isAriaSelected()} selected={renderStrategy.isSelected()}
					setsize={setsize} posinset={this.sectionGroup.sections.length + i + 1} /> :
				<LeafNode node={renderStrategy} treeViewId={Constants.TreeView.id} key={renderStrategy.getId()} globals={this.globals}
					id={renderStrategy.getId()} level={childrenLevel} ariaSelected={renderStrategy.isAriaSelected()} />);

		const sectionRenderStrategies = this.sectionGroup.sections.map(section => new SectionRenderStrategy(section, this.globals));
		const sections = sectionRenderStrategies.map((renderStrategy, i) =>
			!!this.globals.callbacks.onPageSelected ?
				<ExpandableNode expanded={renderStrategy.isExpanded()} node={renderStrategy} globals={this.globals}
					treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
					id={renderStrategy.getId()} level={childrenLevel} ariaSelected={renderStrategy.isAriaSelected()} /> :
				<LeafNode node={renderStrategy} treeViewId={Constants.TreeView.id} key={renderStrategy.getId()} globals={this.globals}
					id={renderStrategy.getId()} level={childrenLevel} ariaSelected={renderStrategy.isAriaSelected()} selected={renderStrategy.isSelected()}
					setsize={setsize} posinset={i + 1} />);

		return [...createNewSection, ...sections, ...sectionGroups];
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

	expandNode(shouldExpand?: boolean) {
		this.sectionGroup.expanded = shouldExpand == undefined ? !this.sectionGroup.expanded : shouldExpand;
	}

	selectNode() {
		this.expandNode()
	}

	private onClick() {
		// No additional functionality
		this.expandNode()
	}
}
