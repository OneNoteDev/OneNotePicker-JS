import * as React from 'react';

class SectionItem extends React.Component<{section: OneNoteApi.Section}, null> {
	render() {
		return (
			<li>
				<a>{ this.props.section.name }</a>
			</li >
		);
	}
}

export default SectionItem;
