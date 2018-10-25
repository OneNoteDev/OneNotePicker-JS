import * as React from 'react';
import { Section } from '../../oneNoteDataStructures/section';
import { OneNoteItemUtils } from '../../oneNoteDataStructures/oneNoteItemUtils';
import { InnerGlobals } from '../../props/globalProps';
import { SectionIconSvg } from '../icons/sectionIcon.svg';
import { NodeRenderStrategy } from '../treeView/nodeRenderStrategy';

export class RecentSectionRenderStrategy implements NodeRenderStrategy {
	onClickBinded = this.onClick.bind(this);

	constructor(private section: Section, private globals: InnerGlobals) {
	}

	element(): JSX.Element {
		return (
			<div className={this.isSelected() ? 'picker-selectedItem section' : 'section'} title={this.section.name}>
				<div className='picker-icon'>
					<SectionIconSvg/>
				</div>
				<div className='picker-label'>
					<label>{this.section.name}</label>
					<label className='parent'>{this.section.parent ? this.section.parent.name : ''}</label>
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

	isSelected(): boolean {
		return this.globals.selectedId === this.getId();
	}

	isAriaSelected(): boolean {
		return this.globals.ariaSelectedId ? this.globals.ariaSelectedId === this.getId() : false;
	}

	private onClick() {
		const onRecentSectionSelected = this.globals.callbacks.onRecentSectionSelected;
		if (!!onRecentSectionSelected) {
			onRecentSectionSelected(this.section, OneNoteItemUtils.getAncestry(this.section));
		}
	}
}
