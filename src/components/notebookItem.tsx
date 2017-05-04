import * as React from 'react';

import SectionItem from './sectionItem';
import SectionGroupItem from './sectionGroupItem';
import GlobalProps from '../props/globalProps';

interface NotebookItemProps extends GlobalProps {
	notebook: OneNoteApi.Notebook;
}

interface NotebookItemState {
	expanded: boolean;
}

class NotebookItem extends React.Component<NotebookItemProps, NotebookItemState> {
	constructor(props) {
		super(props);
		this.state = { expanded: false };
	}

	render() {
		let { expanded } = this.state;

		return (
			<li>
				<a onClick={() => this.setState({ expanded: !expanded })}>{this.props.notebook.name}</a>
				<ul style={this.state.expanded ? { display: 'block' } : { display: 'none' }}>
					{this.props.notebook.sectionGroups.map(sectionGroup => <SectionGroupItem globals={this.props.globals} sectionGroup={sectionGroup} key={sectionGroup.name}></SectionGroupItem>)}
					{this.props.notebook.sections.map(section => <SectionItem globals={this.props.globals} section={section} key={section.name}></SectionItem>)}
				</ul>
			</li>
		);
	}
}

export default NotebookItem;
