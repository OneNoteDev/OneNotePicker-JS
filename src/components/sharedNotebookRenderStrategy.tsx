import * as React from 'react';

import {SectionRenderStrategy} from './sectionRenderStrategy';
import {SectionGroupRenderStrategy} from './sectionGroupRenderStrategy';
import {ExpandableNodeRenderStrategy} from './treeView/expandableNodeRenderStrategy';
import {ExpandableNode} from './treeView/expandableNode';
import {LeafNode} from './treeView/leafNode';
import {Constants} from '../constants';
import {Strings} from '../strings';
import {SharedNotebook} from '../oneNoteDataStructures/sharedNotebook';
import {InnerGlobals} from '../props/globalProps';
import {OneNoteItemUtils} from '../oneNoteDataStructures/oneNoteItemUtils';

export class SharedNotebookRenderStrategy implements ExpandableNodeRenderStrategy {
	onClickBinded = this.onClick.bind(this);
	onExpandBinded = this.onExpand.bind(this);

	constructor(private notebook: SharedNotebook, private globals: InnerGlobals) { }

	element(): JSX.Element {
		return (
			<div className={this.isSelected() ? 'picker-selectedItem' : ''} title={this.breadcrumbs() + '/' + this.notebook.name}>
				<div className='picker-icon-left'>
					<img
						src={require('../images/notebook_icon.png')}
						alt={Strings.get('Accessibility.NotebookIcon', this.globals.strings)}/>
				</div>
				<div>
					<label>{this.notebook.name}</label>
					<label className='breadcrumbs'>{this.breadcrumbs()}</label>
				</div>
				<div className='picker-icon-right'>
					<span aria-hidden='true'>{Strings.get('Shared', this.globals.strings)}</span>
					<img
						src={require('../images/shared_icon.png')}
						alt={Strings.get('Shared', this.globals.strings)}/>
				</div>
			</div>);
	}

	getId(): string {
		return this.notebook.webUrl;
	}

	getName(): string {
		return this.notebook.name;
	}

	getChildren(childrenLevel: number): JSX.Element[] {
		// This may not work as we need to trigger a re-render
		if (this.notebook.apiHttpErrorCode) {
			let errorString = Strings.getError(this.notebook.apiHttpErrorCode, this.globals.strings);
			return [
				<li role='status' aria-live='polite' aria-label={errorString} className='progress-row'>
					<div>{errorString}</div>
				</li>
			];
		}

		if (!this.notebook.apiProperties) {
			return [
				<li className='progress-row'>
					<div className='progress-spinner'></div>
				</li>
			];
		}

		let sectionGroupRenderStrategies = this.notebook.apiProperties.spSectionGroups.map(sectionGroup => new SectionGroupRenderStrategy(sectionGroup, this.globals));
		let sectionGroups = sectionGroupRenderStrategies.map(renderStrategy =>
			!!this.globals.callbacks.onSectionSelected || !!this.globals.callbacks.onPageSelected ?
				<ExpandableNode
					expanded={renderStrategy.isExpanded()} node={renderStrategy} globals={this.globals}
					treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
					id={renderStrategy.getId()} level={childrenLevel} ariaSelected={renderStrategy.isAriaSelected()}></ExpandableNode> :
				<LeafNode node={renderStrategy} treeViewId={Constants.TreeView.id} key={renderStrategy.getId()} globals={this.globals}
					id={renderStrategy.getId()} level={childrenLevel} ariaSelected={renderStrategy.isAriaSelected()}></LeafNode>);

		let sectionRenderStrategies = this.notebook.apiProperties.spSections.map(section => new SectionRenderStrategy(section, this.globals));
		let sections = sectionRenderStrategies.map(renderStrategy =>
			!!this.globals.callbacks.onPageSelected ?
				<ExpandableNode
					expanded={renderStrategy.isExpanded()} node={renderStrategy} globals={this.globals}
					treeViewId={Constants.TreeView.id} key={renderStrategy.getId() }
					id={renderStrategy.getId()} level={childrenLevel} ariaSelected={renderStrategy.isAriaSelected()}></ExpandableNode> :
				<LeafNode node={renderStrategy} treeViewId={Constants.TreeView.id} key={renderStrategy.getId()} globals={this.globals}
					id={renderStrategy.getId()} level={childrenLevel} ariaSelected={renderStrategy.isAriaSelected()}></LeafNode>);

		return sectionGroups.concat(sections);
	}

	isExpanded(): boolean {
		return this.notebook.expanded;
	}

	isSelected(): boolean {
		return this.notebook.apiProperties ? this.globals.selectedId === this.notebook.apiProperties.id : false;
	}

	isAriaSelected(): boolean {
		return this.globals.ariaSelectedId ? this.globals.ariaSelectedId === this.getId() : false;
	}

	private onClick() {
		let { onNotebookSelected } = this.globals.callbacks;
		if (!!onNotebookSelected) {
			onNotebookSelected(this.notebook, OneNoteItemUtils.getAncestry(this.notebook));
		}
	}

	private onExpand() {
		if (this.isExpandable()) {
			if (!this.notebook.apiProperties && !this.notebook.startedLoading) {
				// This notebook was made known to us by GetRecentNotebooks, but we haven't
				// fetched any metadata or children info
				this.notebook.startedLoading = true;
				const depth = this.globals.notebookExpandDepth || 5;
				this.globals.oneNoteDataProvider.getSpNotebookProperties(this.notebook, depth, true).then((apiProperties) => {
					if (!apiProperties) {
						this.notebook.apiHttpErrorCode = 404;
						return;
					}

					this.notebook.apiProperties = apiProperties;

					if (this.globals.notebookListUpdater) {
						this.globals.notebookListUpdater.updateNotebookList([this.notebook]);
					}
				}).catch((xhrs: XMLHttpRequest[]) => {
					let max = 0;
					for (let i = 0; i < xhrs.length; i++) {
						max = Math.max(xhrs[i].status, max);
					}
					this.notebook.apiHttpErrorCode = max;
				}).then(() => {
					let { onSharedNotebookInfoReturned } = this.globals.callbacks;
					if (!!onSharedNotebookInfoReturned) {
						onSharedNotebookInfoReturned(this.notebook);
					}
				});
			}
		}
	}

	private breadcrumbs(): string {
		let url = this.notebook.webUrl;
		let split = url.split('/');
		return split.slice(3, -1).map(decodeURIComponent).join('/');
	}

	private isExpandable(): boolean {
		return !!this.globals.callbacks.onSectionSelected || !!this.globals.callbacks.onPageSelected;
	}
}
