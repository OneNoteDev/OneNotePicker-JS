import * as React from 'react';

import { Strings } from '../strings';
import { NodeRenderStrategy } from './treeView/nodeRenderStrategy';
import { Page } from '../oneNoteDataStructures/page';
import { OneNoteItemUtils } from '../oneNoteDataStructures/oneNoteItemUtils';
import { InnerGlobals } from '../props/globalProps';

export class PageRenderStrategy implements NodeRenderStrategy {
	onClickBinded = this.onClick.bind(this);

	constructor(private page: Page, private globals: InnerGlobals) { }

	element(): JSX.Element {
		// TODO image is a placeholder as we don't support pages yet
		return (
			<div className={this.isSelected() ? 'picker-selectedItem' : ''} title={this.page.name}>
				<div className='picker-icon'>
					<img
						src={require('../images/section_icon.png')}
						alt={Strings.get('Accessibility.PageIcon', this.globals.strings)} />
				</div>
				<div>
					<label className='ms-fontSize-sPlus'>{this.page.name}</label>
				</div>
			</div>
		);
	}

	getName(): string {
		return this.page.name;
	}

	getId(): string {
		return this.page.id;
	}

	isSelected(): boolean {
		return this.globals.selectedId === this.page.id;
	}

	isAriaSelected(): boolean {
		return this.globals.ariaSelectedId ? this.globals.ariaSelectedId === this.getId() : false;
	}

	private onClick() {
		const onPageSelected = this.globals.callbacks.onPageSelected;
		if (!!onPageSelected) {
			onPageSelected(this.page, OneNoteItemUtils.getAncestry(this.page));
		}
	}
}
