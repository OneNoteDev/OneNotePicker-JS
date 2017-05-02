import * as React from 'react';
import SectionItem from './sectionItem';
import SectionGroupItem from './sectionGroupItem';

class NotebookItem extends React.Component<{notebook: OneNoteApi.Notebook}, null> {
	render() {
		return (
			<li>
				<a className={'is-active'}>{this.props.notebook.name}</a>
				<ul>
					{this.props.notebook.sectionGroups.map(sectionGroup => <SectionGroupItem sectionGroup={sectionGroup} key={sectionGroup.name}></SectionGroupItem>)}
					{this.props.notebook.sections.map(section => <SectionItem section={section} key={section.name}></SectionItem>)}
				</ul>
			</li>
		);
	}
}

export default NotebookItem;
