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
				<a onClick={() => this.setState({ expanded: !expanded })}>
					<span className='ms-font-m-plus ms-fontWeight-semibold ms-fontColor-themePrimary'>
						<i className='picker-icon-left ms-Icon ms-Icon--Sections'></i>
						{this.props.sectionGroup.name}
						<i className='picker-icon-right ms-Icon ms-Icon--ChevronDownMed'></i>
					</span>
				</a>
				<ul className='picker-list-header' style={this.state.expanded ? { display: 'block' } : { display: 'none' }}>
					{this.props.sectionGroup.sectionGroups.map(sectionGroup => <SectionGroupItem sectionGroup={sectionGroup} key={sectionGroup.name}></SectionGroupItem>)}
					{this.props.sectionGroup.sections.map(section => <SectionItem section={section} key={section.name}></SectionItem>)}
				</ul>
			</li>
		);
	}
}

export default SectionGroupItem;
