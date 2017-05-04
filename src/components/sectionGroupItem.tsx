import * as React from 'react';
import SectionItem from './sectionItem';

class SectionGroupItem extends React.Component<{ sectionGroup: OneNoteApi.SectionGroup }, any> {
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
					{this.props.sectionGroup.sectionGroups.map(sectionGroup => <SectionGroupItem sectionGroup={sectionGroup} key={sectionGroup.name}></SectionGroupItem>)}
					{this.props.sectionGroup.sections.map(section => <SectionItem section={section} key={section.name}></SectionItem>)}
				</ul>
			</li>
		);
	}
}

export default SectionGroupItem;
