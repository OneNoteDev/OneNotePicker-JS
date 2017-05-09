import * as React from 'react';

import SectionItem from './sectionItem';
import SectionGroupItem from './sectionGroupItem';
import GlobalProps from '../props/globalProps';
import Notebook from '../oneNoteDataStructures/notebook';

interface NotebookItemProps extends GlobalProps {
	notebook: Notebook;
}

interface NotebookItemState {
	expanded: boolean;
}

class NotebookItem extends React.Component<NotebookItemProps, NotebookItemState> {
	constructor(props) {
		super(props);
		this.state = { expanded: props.expanded };
	}

	render() {
		let { expanded } = this.state;

		return (
			<li>
				<a onClick={() => {
					this.setState({ expanded: !expanded });
					this.props.globals.callbacks.onNotebookSelected(this.props.notebook);
				}}>
					<span className='ms-font-l ms-fontWeight-regular ms-fontColor-themePrimary'>
						<i className='picker-icon-left ms-Icon ms-Icon--OneNoteLogo'></i>
						{this.props.notebook.name}
						<i className='picker-icon-right ms-Icon ms-Icon--ChevronDownMed'></i>
					</span>
				</a>
				<ul className='picker-list-header' style={this.state.expanded ? { display: 'block' } : { display: 'none' }}>
					{this.props.notebook.sectionGroups.map(sectionGroup => <SectionGroupItem globals={this.props.globals} sectionGroup={sectionGroup} key={sectionGroup.name}></SectionGroupItem>)}
					{this.props.notebook.sections.map(section => <SectionItem globals={this.props.globals} section={section} key={section.name}></SectionItem>)}
				</ul>
			</li>
		);
	}
}

export default NotebookItem;
