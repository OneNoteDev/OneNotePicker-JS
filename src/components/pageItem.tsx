import * as React from 'react';

import {GlobalProps} from '../props/globalProps';
import {Page} from '../oneNoteDataStructures/page';
import {OneNoteItemUtils} from '../oneNoteDataStructures/oneNoteItemUtils';

export interface PageItemProps extends GlobalProps {
	page: Page;
}

export class PageItem extends React.Component<PageItemProps, null> {
	private onClick() {
		let onPageSelected = this.props.globals.callbacks.onPageSelected;
		if (!!onPageSelected) {
			onPageSelected(this.props.page, OneNoteItemUtils.getAncestry(this.props.page));
		}
	}

	private isSelected(): boolean {
		return this.props.globals.selectedId === this.props.page.id;
	}

	render() {
		let isSelected = this.isSelected();

		// TODO image is a placeholder as we don't support pages yet
		return (
			<li aria-selected={isSelected} role='treeitem'>
				<a className={isSelected ? 'picker-selectedItem' : ''} onClick={this.onClick.bind(this)} tabIndex={0}
				   href='#'>
					<div className='picker-icon-left'>
						<img src={require('../images/section_icon.png')}/>
					</div>
					<div>
						<label className='ms-fontSize-sPlus'>{this.props.page.name}</label>
					</div>
				</a>
			</li >
		);
	}
}
