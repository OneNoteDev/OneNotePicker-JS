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
		return (
			<div className={this.isSelected() ? 'picker-selectedItem' : ''} title={this.section.name}>
				<div className='picker-icon-left'>
				<svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
					viewBox='0 0 20 20' style={{enableBackground: 'new 0 0 20 20'}} xmlSpace='preserve'>
					<style type='text/css'>
						{'.st0 { fill:none;}'}
					</style>
					<g>
						<rect y='0' className='st0' width='20' height='20' />
						<path d='M12,3H6v14h6v2h1V1h-1V3z'/>
					</g>
				</svg>
				</div>
				<div>
					<label className='ms-fontSize-sPlus'>{this.section.name}</label>
				</div>
			</div>);
	}

	getName(): string {
		return this.section.name;
	}

	getId(): string {
		return this.section.id;
	}

	getChildren(childrenLevel: number): JSX.Element[] {
		let pageRenderStrategies: PageRenderStrategy[] | undefined =
			this.section.pages && this.section.pages.map(page => new PageRenderStrategy(page, this.globals));
		let pages = pageRenderStrategies && pageRenderStrategies.map(renderStrategy =>
			<LeafNode treeViewId={Constants.TreeView.id} node={renderStrategy} globals={this.globals}
				id={renderStrategy.getId()} level={childrenLevel}
				ariaSelected={renderStrategy.isAriaSelected()}></LeafNode>);

		return pages || [] as JSX.Element[];
	}

	isExpanded(): boolean {
		return this.section.expanded;
	}

	isSelected(): boolean {
		return this.globals.selectedId === this.section.id;
	}

	isAriaSelected(): boolean {
		return this.globals.ariaSelectedId ? this.globals.ariaSelectedId === this.getId() : false;
	}

	private onClick() {
		let onSectionSelected = this.globals.callbacks.onSectionSelected;
		if (!!onSectionSelected) {
			onSectionSelected(this.section, OneNoteItemUtils.getAncestry(this.section));
		}
	}
}
