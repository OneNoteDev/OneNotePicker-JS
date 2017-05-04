import * as React from 'react';

import GlobalProps from '../props/globalProps';

interface SectionItemProps extends GlobalProps {
	section: OneNoteApi.Section;
}

class SectionItem extends React.Component<SectionItemProps, null> {
	render() {
		return (
			<li>
				<a>{ this.props.section.name }</a>
			</li >
		);
	}
}

export default SectionItem;
