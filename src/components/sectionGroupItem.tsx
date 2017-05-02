import * as React from 'react';
import SectionItem from './sectionItem';

class SectionGroupItem extends React.Component<{sectionGroup: OneNoteApi.SectionGroup}, null> {
	render() {
		return (
			<li>
				<a className={'is-active'}>{this.props.sectionGroup.name}</a>
				<ul>
					{this.props.sectionGroup.sectionGroups.map(sectionGroup => <SectionGroupItem sectionGroup={sectionGroup} key={sectionGroup.name}></SectionGroupItem>)}
					{this.props.sectionGroup.sections.map(section => <SectionItem section={section} key={section.name}></SectionItem>)}
				</ul>
			</li>
		);
	}
}

export default SectionGroupItem;
