import * as React from 'react';

import {PageRenderStrategy} from './pageRenderStrategy';
import {ExpandableNodeRenderStrategy} from './treeView/expandableNodeRenderStrategy';
import {LeafNode} from './treeView/leafNode';
import {Constants} from '../constants';
import {Section} from '../oneNoteDataStructures/section';
import {OneNoteItemUtils} from '../oneNoteDataStructures/oneNoteItemUtils';
import {InnerGlobals} from '../props/globalProps';

export class SectionRenderStrategy implements ExpandableNodeRenderStrategy {
	onClickBinded = this.onClick.bind(this);

	constructor(private section: Section, private globals: InnerGlobals) { }
	
	element(): JSX.Element {
		let isSelected = this.isSelected();

		return (
			<div aria-selected={isSelected} className={isSelected ? 'picker-selectedItem' : ''} title={this.section.name}>
				<div className='picker-icon-left'>
					<img src={require('../images/section_icon.png')}/>
				</div>
				<div>
					<label className='ms-fontSize-sPlus'>{this.section.name}</label>
				</div>
			</div>);
	}

	getId(): string {
		return this.section.id;
	}

	getChildren(): JSX.Element[] {
		let pageRenderStrategies: PageRenderStrategy[] | undefined =
			this.section.pages && this.section.pages.map(page => new PageRenderStrategy(page, this.globals));
		let pages = pageRenderStrategies && pageRenderStrategies.map(renderStrategy =>
			<LeafNode treeViewId={Constants.TreeView.id} node={renderStrategy}
			id={renderStrategy.getId()}></LeafNode>);

		return pages || [] as JSX.Element[];
	}

	isExpanded(): boolean {
		return this.section.expanded;
	}

	private isSelected(): boolean {
		return this.globals.selectedId === this.section.id;
	}

	private onClick() {
		let onSectionSelected = this.globals.callbacks.onSectionSelected;
		if (!!onSectionSelected) {
			onSectionSelected(this.section, OneNoteItemUtils.getAncestry(this.section));
		}
	}
}
