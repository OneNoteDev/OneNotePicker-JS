import * as React from 'react';
import { SectionRenderStrategy } from './sectionRenderStrategy';
import { SectionGroupRenderStrategy } from './sectionGroupRenderStrategy';
import { ExpandableNodeRenderStrategy } from './treeView/expandableNodeRenderStrategy';
import { ExpandableNode } from './treeView/expandableNode';
import { LeafNode } from './treeView/leafNode';
import { Constants } from '../constants';
import { Notebook } from '../oneNoteDataStructures/notebook';
import { OneNoteItemUtils } from '../oneNoteDataStructures/oneNoteItemUtils';
import { InnerGlobals } from '../props/globalProps';
import { NotebookOpenedIconSvg } from './icons/notebookOpenedIcon.svg';
import { NotebookClosedIconSvg } from './icons/notebookClosedIcon.svg';
import { ChevronSvg } from './icons/chevron.svg';
import { CreateNewSectionNode } from './createNewSection/createNewSectionNode';
import * as OneNoteApi from 'onenoteapi';
import { SpinnerIconSvg } from './icons/spinnerIcon.svg';
import { Strings } from '../strings';

export class NotebookRenderStrategy implements ExpandableNodeRenderStrategy {
	onClickBinded = () => {};
	onExpandBinded = this.onExpand.bind(this);

	constructor(private notebook: Notebook, private globals: InnerGlobals) { }

	element(): JSX.Element {
		return (
			<div className={this.isSelected() ? 'picker-selectedItem picker-item notebook' : 'picker-item notebook'} title={this.breadcrumbs() + '/' + this.notebook.name} onClick={this.onClick.bind(this)}>
				<div className={this.isExpanded() ? 'chevron-icon opened' : 'chevron-icon closed'} onClick={this.onChevronClick.bind(this)}>
					<ChevronSvg />
				</div>
				<div className='picker-icon'>
					{this.isExpanded() ? <NotebookOpenedIconSvg /> : <NotebookClosedIconSvg />}
				</div>
				<div className='picker-label'>
					<label>{this.notebook.name}</label>
				</div>
			</div>);
	}

	getName(): string {
		return this.notebook.name;
	}

	getId(): string {
		return this.notebook.id;
	}

	getChildren(childrenLevel: number): JSX.Element[] {
		if (typeof (this.notebook.apiHttpErrorCode) === 'number') {
			const errorString = Strings.getError(this.notebook.apiHttpErrorCode);
			return [
				<li role='status' aria-live='polite' aria-label={errorString} className='progress-row'>
					<div>{errorString}</div>
				</li>
			];
		}

		if (this.notebook.needsToFetchChildren) {
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

		const setsize = this.notebook.sections.length + this.notebook.sectionGroups.length;

		const sectionGroupRenderStrategies = this.notebook.sectionGroups.map(sectionGroup => new SectionGroupRenderStrategy(sectionGroup, this.globals));
		const sectionGroups = sectionGroupRenderStrategies.map((renderStrategy, i) =>
			!!this.globals.callbacks.onSectionSelected || !!this.globals.callbacks.onPageSelected ?
				<ExpandableNode
					expanded={renderStrategy.isExpanded()} node={renderStrategy} globals={this.globals}
					treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
					id={renderStrategy.getId()} level={childrenLevel} ariaSelected={renderStrategy.isAriaSelected()} selected={renderStrategy.isSelected()}
					setsize={setsize} posinset={this.notebook.sections.length + i + 1} /> :
				<LeafNode node={renderStrategy} treeViewId={Constants.TreeView.id} key={renderStrategy.getId()} globals={this.globals}
					id={renderStrategy.getId()} level={childrenLevel} ariaSelected={renderStrategy.isAriaSelected()} />);

		const sectionRenderStrategies = this.notebook.sections.map(section => new SectionRenderStrategy(section, this.globals));
		const sections = sectionRenderStrategies.map((renderStrategy, i) =>
			!!this.globals.callbacks.onPageSelected ?
				<ExpandableNode
					expanded={renderStrategy.isExpanded()} node={renderStrategy} globals={this.globals}
					treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
					id={renderStrategy.getId()} level={childrenLevel} ariaSelected={renderStrategy.isAriaSelected()} /> :
				<LeafNode node={renderStrategy} treeViewId={Constants.TreeView.id} key={renderStrategy.getId()} globals={this.globals}
					id={renderStrategy.getId()} level={childrenLevel} ariaSelected={renderStrategy.isAriaSelected()} selected={renderStrategy.isSelected()}
					setsize={setsize} posinset={i + 1} />);

		return [...createNewSection, ...sections, ...sectionGroups];
	}

	isExpanded(): boolean {
		return this.notebook.expanded;
	}

	isSelected(): boolean {
		return this.globals.selectedId === this.notebook.id;
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
		const onNotebookSelected = this.globals.callbacks.onNotebookSelected;
		if (!!onNotebookSelected) {
			onNotebookSelected(this.notebook, OneNoteItemUtils.getAncestry(this.notebook));
		}
	}

	private breadcrumbs(): string {
		const url = this.notebook.webUrl;
		const split = url.split('/');
		return split.slice(3, -1).map(decodeURIComponent).join('/');
	}

	private onClick() {
		this.selectNode();
	}

	private onChevronClick() {
		this.expandNode();
	}

	private onExpand() {
		if (this.notebook.needsToFetchChildren && this.notebook.apiUrl && this.globals.oneNoteDataProvider && !!this.globals.callbacks.onNotebookInfoReturned) {
			this.globals.oneNoteDataProvider.getNotebookBySelfUrl(this.notebook.apiUrl, 5).then((notebook) => {
				this.notebook.sections = notebook.sections
				this.notebook.sectionGroups = notebook.sectionGroups
			}).catch((apiError: OneNoteApi.RequestError) => {
				this.notebook.apiHttpErrorCode = apiError.statusCode;
			}).then(() => {
				this.notebook.needsToFetchChildren = false;
				if (!!this.globals.callbacks.onNotebookInfoReturned) {
					this.globals.callbacks.onNotebookInfoReturned(this.notebook);
				}
			})
		}
	}
}
