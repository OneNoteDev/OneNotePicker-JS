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

		globals.callbacks.onSectionSelected(section);

		if (!section.pages) {
			// Trigger external call to fetch pages for this section
			globals.oneNoteDataProvider.getPages(section.id).then((pages) => {
				globals.notebookListUpdater.updatePages(section.id, pages);
				let newNotebookHierarchy = globals.notebookListUpdater.get();
				globals.callbacks.onNotebookHierarchyUpdated(newNotebookHierarchy);
			});
		}

		this.setState({ expanded: !this.state.expanded });
	}

	render() {
		let { expanded } = this.state;
		let pages = this.props.section.pages;

		let selected = this.props.globals.selectedId === this.props.section.id;

		return (
			<li>
				<a className={selected ? 'picker-selectedItem' : ''} onClick={this.onClick.bind(this)}>
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
