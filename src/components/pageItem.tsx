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
				<a>{ this.props.page.title }</a>
			</li >
		);
	}
}

export default PageItem;