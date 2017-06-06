import * as React from 'react';

import {RenderableNode} from './treeView/renderableNode';
import {Page} from '../oneNoteDataStructures/page';
import {OneNoteItemUtils} from '../oneNoteDataStructures/oneNoteItemUtils';

export class PageNode implements RenderableNode {
	// TODO strong typing for globals
	constructor(private page: Page, private globals) { }

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

	onClick() {
		let onPageSelected = this.globals.callbacks.onPageSelected;
		if (!!onPageSelected) {
			onPageSelected(this.page, OneNoteItemUtils.getAncestry(this.page));
		}
	}

	getKey(): string {
		return this.page.id;
	}

	private isSelected(): boolean {
		return this.globals.selectedId === this.page.id;
	}
}
