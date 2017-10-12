import * as React from 'react';

import {SectionRenderStrategy} from './sectionRenderStrategy';
import {SectionGroupRenderStrategy} from './sectionGroupRenderStrategy';
import {ExpandableNodeRenderStrategy} from './treeView/expandableNodeRenderStrategy';
import {ExpandableNode} from './treeView/expandableNode';
import {LeafNode} from './treeView/leafNode';
import {Constants} from '../constants';
import {SharedNotebook} from '../oneNoteDataStructures/sharedNotebook';
import {InnerGlobals} from '../props/globalProps';
import {OneNoteItemUtils} from '../oneNoteDataStructures/oneNoteItemUtils';

export class SharedNotebookRenderStrategy implements ExpandableNodeRenderStrategy {
	onClickBinded = this.onClick.bind(this);

	constructor(private notebook: SharedNotebook, private globals: InnerGlobals) { }

	element(): JSX.Element {
		let isSelected = this.isSelected();

		return (
			<div aria-selected={isSelected} className={isSelected ? 'picker-selectedItem' : ''} title={this.notebook.name}>
				<div className='picker-icon-left'>
					<img src={require('../images/shared_notebook_icon.png')}/>
				</div>
				<label className='ms-fontSize-sPlus'>{this.notebook.name}</label>
				<div className='picker-icon-right'>
					<img src={require('../images/shared_notebook_icon.png')}/>
				</div>
			</div>);
	}

	getId(): string {
		return this.notebook.webUrl;
	}

	getChildren(): JSX.Element[] {
		// TODO (machiam) return a spinny boi if not 'loaded'
		let sectionGroupRenderStrategies = !!this.notebook.apiProperties ?
			this.notebook.apiProperties.spSectionGroups.map(sectionGroup => new SectionGroupRenderStrategy(sectionGroup, this.globals)) : [];
		let sectionGroups = sectionGroupRenderStrategies.map(renderStrategy =>
			!!this.globals.callbacks.onSectionSelected || !!this.globals.callbacks.onPageSelected ?
				<ExpandableNode	expanded={renderStrategy.isExpanded()} node={renderStrategy}
					treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
					id={renderStrategy.getId()}></ExpandableNode> :
				<LeafNode node={renderStrategy} treeViewId={Constants.TreeView.id} key={renderStrategy.getId()} id={renderStrategy.getId()}></LeafNode>);

		let sectionRenderStrategies = !!this.notebook.apiProperties ?
			this.notebook.apiProperties.spSections.map(section => new SectionRenderStrategy(section, this.globals)) : [];
		let sections = sectionRenderStrategies.map(renderStrategy =>
			!!this.globals.callbacks.onPageSelected ?
				<ExpandableNode
					expanded={renderStrategy.isExpanded()} node={renderStrategy}
					treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
					id={renderStrategy.getId()}></ExpandableNode> :
				<LeafNode node={renderStrategy} treeViewId={Constants.TreeView.id} key={renderStrategy.getId()} id={renderStrategy.getId()}></LeafNode>);

		return sectionGroups.concat(sections);
	}

	isExpanded(): boolean {
		return this.notebook.expanded;
	}

	private isSelected(): boolean {
		return this.notebook.apiProperties ? this.globals.selectedId === this.notebook.apiProperties.id : false;
	}

	private onClick() {
		if (this.isExpandable()) {
			if (!this.notebook.apiProperties) {
				// This notebook was made known to us by GetRecentNotebooks, but we haven't
				// fetched any metadata or children info
				if (this.notebook.sourceService === 'OneDriveForBusiness') {
					this.globals.oneNoteDataProvider.getSpNotebookProperties(
						this.notebook, 5 /* TODO (machiam) not being used */, true /* TODO (machiam) also not being used */).then((apiProperties) => {
							// TODO (machiam) we need to somehow trigger a re-render by notifying the parent
							this.notebook.apiProperties = apiProperties;

							if (!!this.globals.notebookListUpdater) {
								this.globals.notebookListUpdater.updateNotebookList([this.notebook]);
							}

							let { onNotebookSelected, onSharedNotebookInfoReturned } = this.globals.callbacks;

							if (!!onNotebookSelected) {
								onNotebookSelected(this.notebook, OneNoteItemUtils.getAncestry(this.notebook));
							}

							if (!!onSharedNotebookInfoReturned) {
								onSharedNotebookInfoReturned(this.notebook);
							}
						}).catch((err) => {
							console.log('bleh');
						});
				} else {
					// TODO (machiam) we currently only support ODB, so the notebooks passed into the picker
					// are assumed to have their sourceService set to OneDriveForBusiness
				}
			}
		}
	}

	private isExpandable(): boolean {
		return !!this.globals.callbacks.onSectionSelected || !!this.globals.callbacks.onPageSelected;
	}
}
