import * as React from 'react';

import SectionItem from './sectionItem';
import GlobalProps from '../props/globalProps';
import SectionGroup from '../oneNoteDataStructures/sectionGroup';

interface SectionGroupItemProps extends GlobalProps {
	sectionGroup: SectionGroup;
}

interface SectionGroupItemState {
	expanded: boolean;
}

class SectionGroupItem extends React.Component<SectionGroupItemProps, SectionGroupItemState> {
	constructor(props) {
		super(props);
		this.state = { expanded: props.expanded };
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
					{this.props.sectionGroup.sectionGroups.map(sectionGroup => <SectionGroupItem globals={this.props.globals} sectionGroup={sectionGroup} key={sectionGroup.name}></SectionGroupItem>)}
					{this.props.sectionGroup.sections.map(section => <SectionItem globals={this.props.globals} section={section} key={section.name}></SectionItem>)}
				</ul>
			</li>
		);
	}
}

export default SectionGroupItem;
