import * as React from 'react';

import GlobalProps from '../props/globalProps';
import Page from '../oneNoteDataStructures/page';

interface PageItemProps extends GlobalProps {
	page: Page;
}

class PageItem extends React.Component<PageItemProps, null> {
	render() {
		return (
			<li>
				<a>
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