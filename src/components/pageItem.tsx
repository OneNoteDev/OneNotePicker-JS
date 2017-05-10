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
		// TODO image is a placeholder as we don't support pages yet
		return (
			<li>
				<a className={this.isSelected() ? 'picker-selectedItem' : ''} onClick={this.onClick.bind(this)}>
					<div className='picker-icon-left'>
						<img src={require('../images/section_icon.png')}/>
					</div>
					<div>
						<label className='ms-fontSize-sPlus'>{this.props.page.title}</label>
					</div>
				</a>
			</li >
		);
	}
}

export default PageItem;