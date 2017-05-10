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

		// If selection callback exists, assume this item is selectable, and notify the callback
		let onSectionSelected = this.props.globals.callbacks.onSectionSelected;
		if (!!onSectionSelected) {
			onSectionSelected(section);
		}

		// We are only interested in expanding if pages are deemed selectable
		if (this.isExpandable()) {
			if (!section.pages) {
				this.getPagesAndNotify();
			}
			this.setState({ expanded: !this.state.expanded });
		}
	}

	private isExpandable(): boolean {
		return !!this.props.globals.callbacks.onPageSelected;
	}

	private getPagesAndNotify() {
		let globals = this.props.globals;
		let section = this.props.section;

		// Trigger external call to fetch pages for this section
		globals.oneNoteDataProvider.getPages(section.id).then((pages) => {
			globals.notebookListUpdater.updatePages(section.id, pages);
			let newNotebookHierarchy = globals.notebookListUpdater.get();
			globals.callbacks.onNotebookHierarchyUpdated(newNotebookHierarchy);
		});
	}

	private isSelected(): boolean {
		return this.props.globals.selectedId === this.props.section.id;
	}

	render() {
		let pages = this.props.section.pages;

		// TODO we will need to design some sort of 'spinner' experience, likely when (expanded && !pages)
		return (
			<li>
				<a className={this.isSelected() ? 'picker-selectedItem' : ''} onClick={this.onClick.bind(this)}>
					<div className='picker-icon-left'>
						<img src={require('../images/section_icon.png')}/>
					</div>
					<div>
						<label className='ms-fontSize-sPlus'>{this.props.section.name}</label>
					</div>
				</a>
				{!!pages
					? <ul style={this.state.expanded ? { display: 'block' } : { display: 'none' }}>
						{pages.map(page => <PageItem globals={this.props.globals} page={page} key={page.id}></PageItem>)}
					</ul>
					: undefined}
			</li >
		);
	}
}

export default SectionItem;
