import * as React from 'react';

import {NodeRenderStrategy} from './treeView/nodeRenderStrategy';
import {Page} from '../oneNoteDataStructures/page';
import {OneNoteItemUtils} from '../oneNoteDataStructures/oneNoteItemUtils';
import {InnerGlobals} from '../props/globalProps';

export class PageRenderStrategy implements NodeRenderStrategy {
	onClickBinded = this.onClick.bind(this);

	constructor(private page: Page, private globals: InnerGlobals) { }

	element(): JSX.Element {
		let isSelected = this.isSelected();

		// TODO image is a placeholder as we don't support pages yet
		return (
			<div aria-selected={isSelected} className={isSelected ? 'picker-selectedItem' : ''}>
				<div className='picker-icon-left'>
					<img src={require('../images/section_icon.png')}/>
				</div>
				<div>
					<label className='ms-fontSize-sPlus'>{this.page.name}</label>
				</div>
			</div>	
		);
	}

	getId(): string {
		return this.page.id;
	}

	private isSelected(): boolean {
		return this.globals.selectedId === this.page.id;
	}

	private onClick() {
		let onPageSelected = this.globals.callbacks.onPageSelected;
		if (!!onPageSelected) {
			onPageSelected(this.page, OneNoteItemUtils.getAncestry(this.page));
		}
	}
}
