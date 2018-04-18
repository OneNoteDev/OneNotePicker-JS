import * as React from 'react';
import { PageRenderStrategy } from './pageRenderStrategy';
import { ExpandableNodeRenderStrategy } from './treeView/expandableNodeRenderStrategy';
import { LeafNode } from './treeView/leafNode';
import { Constants } from '../constants';
import { Section } from '../oneNoteDataStructures/section';
import { OneNoteItemUtils } from '../oneNoteDataStructures/oneNoteItemUtils';
import { InnerGlobals } from '../props/globalProps';
import { SectionIconSvg } from './icons/sectionIcon.svg';

export class SectionRenderStrategy implements ExpandableNodeRenderStrategy {
	onClickBinded = this.onClick.bind(this);

	constructor(private section: Section, private globals: InnerGlobals) { }
	
	element(): JSX.Element {
		return (
			<div className={this.isSelected() ? 'picker-selectedItem section' : 'section'} title={this.section.name}>
				<div className='picker-icon'>
					<SectionIconSvg/>
				</div>
				<div className='picker-label'>
					<label>{this.section.name}</label>
				</div>
			</div>
		);
	}

	getName(): string {
		return this.section.name;
	}

	getId(): string {
		return this.section.id;
	}

	getChildren(childrenLevel: number): JSX.Element[] {
		const pageRenderStrategies: PageRenderStrategy[] | undefined =
			this.section.pages && this.section.pages.map(page => new PageRenderStrategy(page, this.globals));
		const pages = pageRenderStrategies && pageRenderStrategies.map(renderStrategy =>
			<LeafNode treeViewId={Constants.TreeView.id} node={renderStrategy} globals={this.globals}
				id={renderStrategy.getId()} level={childrenLevel}
				ariaSelected={renderStrategy.isAriaSelected()} />);

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
		const onSectionSelected = this.globals.callbacks.onSectionSelected;
		if (!!onSectionSelected) {
			onSectionSelected(this.section, OneNoteItemUtils.getAncestry(this.section));
		}
	}
}
