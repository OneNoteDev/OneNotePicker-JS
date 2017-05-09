import * as React from 'react';

import PageItem from './pageItem';
import GlobalProps from '../props/globalProps';
import Section from '../oneNoteDataStructures/section';

interface SectionItemProps extends GlobalProps {
	section: Section;
}

interface SectionItemState {
	expanded: boolean;
}

class SectionItem extends React.Component<SectionItemProps, SectionItemState> {
	constructor(props) {
		super(props);
		this.state = { expanded: props.expanded };
	}

	private onClick() {
		let section = this.props.section;
		let globals = this.props.globals;
		let onNotebookHierarchyUpdated = globals.callbacks.onNotebookHierarchyUpdated;
		
		if (!section.pages && !!onNotebookHierarchyUpdated) {
			// Trigger external call to fetch pages for this section
			globals.oneNoteDataProvider.getPages(section.id).then((pages) => {
				globals.notebookListUpdater.updatePages(section.id, pages);
				let newNotebookHierarchy = globals.notebookListUpdater.get();
				if (!!newNotebookHierarchy) {
					onNotebookHierarchyUpdated(newNotebookHierarchy);
				}
			});
		}

		this.setState({ expanded: !this.state.expanded });
		this.props.globals.callbacks.onSectionSelected(this.props.section);
	}

	render() {
		let { expanded } = this.state;
		let pages = this.props.section.pages;

		return (
			<li>
				<a onClick={this.onClick.bind(this)}>
					<span className='ms-font-m ms-fontWeight-regular ms-fontColor-themePrimary'>
						<i className='picker-icon-left ms-Icon ms-Icon--Section'></i>
						{this.props.section.name}
					</span>
				</a>
				{!!pages
					? <ul style={expanded ? { display: 'block' } : { display: 'none' }}>
						{pages.map(page => <PageItem globals={this.props.globals} page={page} key={page.id}></PageItem>)}
					</ul>
					: undefined}
			</li >
		);
	}
}

export default SectionItem;
