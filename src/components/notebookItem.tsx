import * as React from 'react';
import SectionItem from './sectionItem';
import SectionGroupItem from './sectionGroupItem';

class NotebookItem extends React.Component<{ notebook: OneNoteApi.Notebook }, any> {
	constructor(props) {
		super(props);
		this.state = { expanded: false };
	}

	render() {
		let { expanded } = this.state;

		return (
			<li>
				<a onClick={() => this.setState({ expanded: !expanded })}>
					<span className='ms-font-l ms-fontWeight-regular ms-fontColor-themePrimary'>
						<i className='picker-icon-left ms-Icon ms-Icon--OneNoteLogo'></i>
						{this.props.notebook.name}
						<i className='picker-icon-right ms-Icon ms-Icon--ChevronDownMed'></i>
					</span>
				</a>
				<ul className="picker-list-header" style={this.state.expanded ? { display: 'block' } : { display: 'none' }}>
					{this.props.notebook.sectionGroups.map(sectionGroup => <SectionGroupItem sectionGroup={sectionGroup} key={sectionGroup.name}></SectionGroupItem>)}
					{this.props.notebook.sections.map(section => <SectionItem section={section} key={section.name}></SectionItem>)}
				</ul>
			</li>
		);
	}
}

export default NotebookItem;
