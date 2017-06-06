import * as React from 'react';

import {RenderableExpandableNode} from './treeView/renderableNode';
import {ExpandableNode} from './treeView/expandableNode';
import {SectionGroup} from '../oneNoteDataStructures/sectionGroup';
import {SectionNode} from './sectionNode';

export class SectionGroupNode implements RenderableExpandableNode {
	// TODO strong typing for globals
	constructor(private sectionGroup: SectionGroup, private globals) { }
	
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

	onClick() {
		// No additional functionality
	}
	
	isExpanded(): boolean {
		return this.sectionGroup.expanded;
	}

	getKey(): string {
		return this.sectionGroup.id;
	}

	getChildren(): JSX.Element[] {
		let sectionGroupNodes: SectionGroupNode[] = this.sectionGroup.sectionGroups.map(sectionGroup => new SectionGroupNode(sectionGroup, this.globals));
		let sectionGroups = sectionGroupNodes.map(sectionGroup =>
			<ExpandableNode
				expanded={sectionGroup.isExpanded()} node={sectionGroup}
				treeViewId={'oneNotePicker'} key={sectionGroup.getKey()}
				id={sectionGroup.getKey()}></ExpandableNode>);

		let sectionNodes: SectionNode[] = this.sectionGroup.sections.map(section => new SectionNode(section, this.globals));
		let sections = sectionNodes.map(section =>
			<ExpandableNode
				expanded={section.isExpanded()} node={section}
				treeViewId={'oneNotePicker'} key={section.getKey()}
				id={section.getKey()}></ExpandableNode>);

		return sectionGroups.concat(sections);
	}
}
