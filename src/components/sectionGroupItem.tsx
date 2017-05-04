import * as React from 'react';

import SectionItem from './sectionItem';
import GlobalProps from '../props/globalProps';

interface SectionGroupItemProps extends GlobalProps {
	sectionGroup: OneNoteApi.SectionGroup
}

interface SectionGroupItemState {
	expanded: boolean;
}

class SectionGroupItem extends React.Component<SectionGroupItemProps, SectionGroupItemState> {
	constructor(props) {
		super(props);
		this.state = { expanded: false };
	}

	render() {
		let { expanded } = this.state;

		return (
			<li>
				<a onClick={() => this.setState({ expanded: !expanded })}>{this.props.sectionGroup.name}</a>
				<ul style={this.state.expanded ? { display: 'block' } : { display: 'none' }}>
					{this.props.sectionGroup.sectionGroups.map(sectionGroup => <SectionGroupItem globals={this.props.globals} sectionGroup={sectionGroup} key={sectionGroup.name}></SectionGroupItem>)}
					{this.props.sectionGroup.sections.map(section => <SectionItem globals={this.props.globals} section={section} key={section.name}></SectionItem>)}
				</ul>
			</li>
		);
	}
}

export default SectionGroupItem;
