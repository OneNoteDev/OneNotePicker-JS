import * as React from 'react';

import GlobalProps from '../props/globalProps';
import Page from '../oneNoteDataStructures/page';

interface PageItemProps extends GlobalProps {
	page: Page;
}

class PageItem extends React.Component<PageItemProps, null> {
	private onClick() {
		let onPageSelected = this.props.globals.callbacks.onPageSelected;
		if (!!onPageSelected) {
			onPageSelected(this.props.page);
		}
	}

	private isSelected(): boolean {
		return this.props.globals.selectedId === this.props.page.id;
	}

	render() {
		return (
			<li>
				<a className={this.isSelected() ? 'picker-selectedItem' : ''} onClick={this.onClick.bind(this)}>
					<span className='ms-font-m ms-fontWeight-regular ms-fontColor-themePrimary'>
						<i className='picker-icon-left ms-Icon ms-Icon--Page'></i>
						{this.props.page.title}
					</span>
				</a>
			</li >
		);
	}
}

export default PageItem;