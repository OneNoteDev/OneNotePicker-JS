import * as React from 'react';

import './oneNotePicker.scss';

import {Constants} from './constants';
import {Strings} from './strings';
import {NotebookRenderStrategy} from './components/notebookRenderStrategy';
import {SharedNotebookRenderStrategy} from './components/sharedNotebookRenderStrategy';
import {ExpandableNode} from './components/treeView/expandableNode';
import {LeafNode} from './components/treeView/leafNode';
import {ExpandableNodeRenderStrategy} from './components/treeView/expandableNodeRenderStrategy';
import {GlobalProps} from './props/globalProps';
import {Notebook} from './oneNoteDataStructures/notebook';
import {SharedNotebook} from './oneNoteDataStructures/sharedNotebook';

export interface OneNotePickerProps extends GlobalProps {
	notebooks: Notebook[];
	sharedNotebooks?: SharedNotebook[];
}

export class OneNotePicker extends React.Component<OneNotePickerProps, {}> {
	private get treeViewId() {
		return Constants.TreeView.id;
	}

	private get activeDescendentId() {
		if (!this.props.globals.selectedId) {
			return '';
		}
		return this.treeViewId + this.props.globals.selectedId;
	}

	render() {
		let { notebooks, sharedNotebooks, globals } = this.props;
		let { focusOnMount, ariaSelectedId } = globals;

		let notebookRenderStrategies: ExpandableNodeRenderStrategy[] =
			notebooks.map(notebook => new NotebookRenderStrategy(notebook, globals));
		
		let sharedNotebookRenderStrategies: ExpandableNodeRenderStrategy[] = sharedNotebooks ?
			sharedNotebooks.map(sharedNotebook => new SharedNotebookRenderStrategy(sharedNotebook, globals)) : [];

		const noPersonalNotebooks = notebookRenderStrategies.length === 0;

		return (
			<div className='onenote-picker ms-fontColor-themePrimary'>
				<ul role='tree' aria-label={Strings.get('Accessibility.PickerTableName', this.props.globals.strings)}
					className='menu-list picker-list-header' aria-activedescendent={this.activeDescendentId}>
					{notebookRenderStrategies.map((renderStrategy, i) =>
						!!this.props.globals.callbacks.onSectionSelected || !!this.props.globals.callbacks.onPageSelected ?
							<ExpandableNode globals={this.props.globals} expanded={renderStrategy.isExpanded()} node={renderStrategy}
								treeViewId={this.treeViewId} key={renderStrategy.getId()}
								id={renderStrategy.getId()} tabbable={i === 0} focusOnMount={focusOnMount && i === 0}
								ariaSelected={ariaSelectedId ? renderStrategy.isAriaSelected() : i === 0}></ExpandableNode> :
							<LeafNode globals={this.props.globals} node={renderStrategy} treeViewId={this.treeViewId} key={renderStrategy.getId()}
								id={renderStrategy.getId()} tabbable={i === 0} focusOnMount={focusOnMount && i === 0}
								ariaSelected={ariaSelectedId ? renderStrategy.isAriaSelected() : i === 0}></LeafNode>)}

					{sharedNotebookRenderStrategies.map((renderStrategy, i) =>
						!!this.props.globals.callbacks.onSectionSelected || !!this.props.globals.callbacks.onPageSelected ?
							<ExpandableNode globals={this.props.globals} expanded={renderStrategy.isExpanded()} node={renderStrategy}
								treeViewId={this.treeViewId} key={renderStrategy.getId()}
								id={renderStrategy.getId()} tabbable={noPersonalNotebooks && i === 0}
								focusOnMount={focusOnMount && noPersonalNotebooks && i === 0}
								ariaSelected={ariaSelectedId ? renderStrategy.isAriaSelected() : noPersonalNotebooks && i === 0}></ExpandableNode> :
							<LeafNode globals={this.props.globals} node={renderStrategy} treeViewId={this.treeViewId} key={renderStrategy.getId()}
								id={renderStrategy.getId()} tabbable={noPersonalNotebooks && i === 0}
								focusOnMount={focusOnMount && noPersonalNotebooks && i === 0}
								ariaSelected={ariaSelectedId ? renderStrategy.isAriaSelected() : noPersonalNotebooks && i === 0}></LeafNode>)}
				</ul>
			</div>
		);
	}
}
