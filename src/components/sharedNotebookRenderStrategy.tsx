import * as React from 'react';

import { SectionRenderStrategy } from './sectionRenderStrategy';
import { SectionGroupRenderStrategy } from './sectionGroupRenderStrategy';
import { ExpandableNodeRenderStrategy } from './treeView/expandableNodeRenderStrategy';
import { ExpandableNode } from './treeView/expandableNode';
import { LeafNode } from './treeView/leafNode';
import { Constants } from '../constants';
import { Strings } from '../strings';
import { SharedNotebook } from '../oneNoteDataStructures/sharedNotebook';
import { InnerGlobals } from '../props/globalProps';
import { OneNoteItemUtils } from '../oneNoteDataStructures/oneNoteItemUtils';
import { NotebookOpenedIconSvg } from './icons/notebookOpenedIcon.svg';
import { NotebookClosedIconSvg } from './icons/notebookClosedIcon.svg';
import { SpinnerIconSvg } from './icons/spinnerIcon.svg';
import { ChevronSvg } from './icons/chevron.svg';
import { CreateNewSectionNode } from './createNewSection/createNewSectionNode';

export class SharedNotebookRenderStrategy implements ExpandableNodeRenderStrategy {
	onClickBinded = () => {};
	onExpandBinded = this.onExpand.bind(this);

	constructor(private notebook: SharedNotebook, private globals: InnerGlobals) { }

	element(): JSX.Element {
		return (
			<div className={this.isSelected() ? 'picker-selectedItem picker-item shared-notebook' : 'picker-item shared-notebook'} title={this.breadcrumbs() + '/' + this.notebook.name} onClick={this.onClick.bind(this)}>
				<div className={this.isExpanded() ? 'chevron-icon opened' : 'chevron-icon closed'} onClick={this.onChevronClick.bind(this)}>
					<ChevronSvg />
				</div>
				<div className='picker-icon'>
					{this.isExpanded() ? <NotebookOpenedIconSvg /> : <NotebookClosedIconSvg />}
				</div>
				<div className='picker-label'>
					<label>{this.notebook.name}</label>
					<label className='breadcrumbs'>{this.breadcrumbs()}</label>
				</div>
				<div className='picker-shared-icon'>
					<span aria-hidden='true'>{Strings.get('Shared')}</span>
					<i className='ms-Icon ms-Icon--People' />
				</div>
			</div>);
	}

	getId(): string {
		return this.notebook.id ? this.notebook.id : this.notebook.webUrl;
	}

	getName(): string {
		return this.notebook.name;
	}

	getChildren(childrenLevel: number): JSX.Element[] {
		if (this.notebook.apiHttpErrorMessage) {
			const errorString = this.notebook.apiHttpErrorMessage;
			return [
				<li role='status' aria-live='polite' aria-label={errorString} className='progress-row'>
					<div>{errorString}</div>
				</li>
			];
		}

		if (!this.notebook.apiProperties) {
			return [
				<li className='progress-row'>
					<SpinnerIconSvg />
				</li>
			];
		}

		const createNewSection = this.globals.callbacks.onSectionCreated || this.globals.shouldShowCreateEntityInputs ?
			[<CreateNewSectionNode
				key={this.notebook.id + 'createnewsectionnode'}
				{...this.globals}
				parent={this.notebook}
				parentIsNotebook={true}
				level={childrenLevel}
				// TODO (machiam) focusOnMount and tabbable logic will need to be reworked in the single notebook picker,
				// for now we assume this is not top-level
				focusOnMount={false}
				tabbable={false}>
			</CreateNewSectionNode>] :
			[];

		const setsize = this.notebook.apiProperties.spSections.length + this.notebook.apiProperties.spSectionGroups.length;

		const sectionRenderStrategies = this.notebook.apiProperties.spSections.map(section => new SectionRenderStrategy(section, this.globals));
		const sections = sectionRenderStrategies.map((renderStrategy, i) =>
			!!this.globals.callbacks.onPageSelected ?
				<ExpandableNode
					expanded={renderStrategy.isExpanded()} node={renderStrategy} globals={this.globals}
					treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
					id={renderStrategy.getId()} level={childrenLevel} ariaSelected={renderStrategy.isAriaSelected()} /> :
				<LeafNode node={renderStrategy} treeViewId={Constants.TreeView.id} key={renderStrategy.getId()} globals={this.globals}
					id={renderStrategy.getId()} level={childrenLevel} ariaSelected={renderStrategy.isAriaSelected()} selected={renderStrategy.isSelected()}
					setsize={setsize} posinset={i + 1} />);

		const sectionGroupRenderStrategies = this.notebook.apiProperties.spSectionGroups.map(sectionGroup => new SectionGroupRenderStrategy(sectionGroup, this.globals));
		const sectionGroups = sectionGroupRenderStrategies.map((renderStrategy, i) =>
			!!this.globals.callbacks.onSectionSelected || !!this.globals.callbacks.onPageSelected ?
				<ExpandableNode
					expanded={renderStrategy.isExpanded()} node={renderStrategy} globals={this.globals}
					treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
					id={renderStrategy.getId()} level={childrenLevel} ariaSelected={renderStrategy.isAriaSelected()} selected={renderStrategy.isSelected()}
					setsize={setsize} posinset={this.notebook.apiProperties!.spSections.length + i + 1} /> :
				<LeafNode node={renderStrategy} treeViewId={Constants.TreeView.id} key={renderStrategy.getId()} globals={this.globals}
					id={renderStrategy.getId()} level={childrenLevel} ariaSelected={renderStrategy.isAriaSelected()} />);

		return [...createNewSection, ...sections, ...sectionGroups];
	}

	isExpanded(): boolean {
		return this.notebook.expanded;
	}

	isSelected(): boolean {
		return this.globals.selectedId === this.getId();
	}

	isAriaSelected(): boolean {
		return this.globals.ariaSelectedId ? this.globals.ariaSelectedId === this.getId() : false;
	}

	expandNode(shouldExpand?: boolean) {
		if (this.globals.callbacks.onSectionSelected || this.globals.callbacks.onPageSelected) {
			this.notebook.expanded = shouldExpand === undefined ? !this.notebook.expanded : shouldExpand;
		}
	}

	selectNode() {
		const { onNotebookSelected } = this.globals.callbacks;

		if (!!onNotebookSelected) {
			onNotebookSelected(this.notebook, OneNoteItemUtils.getAncestry(this.notebook));
		}
	}

	private onClick() {
		this.selectNode();
	}

	private onChevronClick() {
		this.expandNode();
	}

	private onExpand() {
		// Check if the picker is expandable
		if ((this.globals.callbacks.onSectionSelected || !!this.globals.callbacks.onPageSelected) &&
			!this.notebook.apiProperties && !this.notebook.startedLoading && this.globals.oneNoteDataProvider) {
			// This notebook was made known to us by GetRecentNotebooks, but we haven't
			// fetched any metadata or children info
			this.notebook.startedLoading = true;
			const depth = this.globals.notebookExpandDepth || 5;

			this.globals.oneNoteDataProvider.getSpNotebookProperties(this.notebook, depth, true).then((apiProperties) => {
				if (!apiProperties) {
					this.notebook.apiHttpErrorMessage = Strings.getError(404);
					return;
				}

				this.notebook.apiProperties = apiProperties;

				if (this.globals.notebookListUpdater) {
					this.globals.notebookListUpdater.updateNotebookList([this.notebook]);
				}
			}).catch((apiError: any) => {
				try {
					this.notebook.apiHttpErrorMessage = JSON.parse(apiError.response).error.message
				} catch (error) {
					this.notebook.apiHttpErrorMessage = Strings.getError(apiError.statusCode);
				}
			}).then(() => {
				const { onSharedNotebookInfoReturned } = this.globals.callbacks;
				if (!!onSharedNotebookInfoReturned) {
					onSharedNotebookInfoReturned(this.notebook);
				}
			});
		}
	}

	private breadcrumbs(): string {
		const url = this.notebook.webUrl;
		const split = url.split('/');
		return split.slice(3, -1).map(decodeURIComponent).join('/');
	}
}
