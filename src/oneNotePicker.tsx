import * as React from 'react';

import './oneNotePicker.scss';

import { OneNotePickerBase } from './oneNotePickerBase';
import { NotebookRenderStrategy } from './components/notebookRenderStrategy';
import { SharedNotebookRenderStrategy } from './components/sharedNotebookRenderStrategy';
import { ExpandableNode } from './components/treeView/expandableNode';
import { LeafNode } from './components/treeView/leafNode';
import { ExpandableNodeRenderStrategy } from './components/treeView/expandableNodeRenderStrategy';
import { GlobalProps } from './props/globalProps';
import { Notebook } from './oneNoteDataStructures/notebook';
import { SharedNotebook } from './oneNoteDataStructures/sharedNotebook';

export interface OneNotePickerProps extends GlobalProps {
	notebooks: Notebook[];
	sharedNotebooks?: SharedNotebook[];
}

export class OneNotePicker extends OneNotePickerBase<OneNotePickerProps, {}> {
	protected get rootNodes(): JSX.Element[] {
		const { notebooks, sharedNotebooks, globals } = this.props;
		const { focusOnMount, ariaSelectedId } = globals;

		const notebookRenderStrategies: ExpandableNodeRenderStrategy[] =
			notebooks.map(notebook => new NotebookRenderStrategy(notebook, globals));

		const sharedNotebookRenderStrategies: ExpandableNodeRenderStrategy[] = sharedNotebooks ?
			sharedNotebooks.map(sharedNotebook => new SharedNotebookRenderStrategy(sharedNotebook, globals)) : [];

		const noPersonalNotebooks = notebookRenderStrategies.length === 0;

		const notebookNodes = notebookRenderStrategies.map((renderStrategy, i) =>
			!!this.props.globals.callbacks.onSectionSelected || !!this.props.globals.callbacks.onPageSelected ?
				<ExpandableNode globals={this.props.globals} expanded={renderStrategy.isExpanded()} node={renderStrategy}
					treeViewId={this.treeViewId} key={renderStrategy.getId()}
					id={renderStrategy.getId()} tabbable={i === 0} focusOnMount={focusOnMount && i === 0}
					ariaSelected={ariaSelectedId ? renderStrategy.isAriaSelected() : i === 0}></ExpandableNode> :
				<LeafNode globals={this.props.globals} node={renderStrategy} treeViewId={this.treeViewId} key={renderStrategy.getId()}
					id={renderStrategy.getId()} tabbable={i === 0} focusOnMount={focusOnMount && i === 0}
					ariaSelected={ariaSelectedId ? renderStrategy.isAriaSelected() : i === 0}></LeafNode>);

		const sharedNotebookNodes = sharedNotebookRenderStrategies.map((renderStrategy, i) =>
			!!this.props.globals.callbacks.onSectionSelected || !!this.props.globals.callbacks.onPageSelected ?
				<ExpandableNode globals={this.props.globals} expanded={renderStrategy.isExpanded()} node={renderStrategy}
					treeViewId={this.treeViewId} key={renderStrategy.getId()}
					id={renderStrategy.getId()} tabbable={noPersonalNotebooks && i === 0}
					focusOnMount={focusOnMount && noPersonalNotebooks && i === 0}
					ariaSelected={ariaSelectedId ? renderStrategy.isAriaSelected() : noPersonalNotebooks && i === 0}></ExpandableNode> :
				<LeafNode globals={this.props.globals} node={renderStrategy} treeViewId={this.treeViewId} key={renderStrategy.getId()}
					id={renderStrategy.getId()} tabbable={noPersonalNotebooks && i === 0}
					focusOnMount={focusOnMount && noPersonalNotebooks && i === 0}
					ariaSelected={ariaSelectedId ? renderStrategy.isAriaSelected() : noPersonalNotebooks && i === 0}></LeafNode>);

		return notebookNodes.concat(sharedNotebookNodes);
	}
}

export * from './oneNoteSingleNotebookPicker';
export * from './oneNoteSingleNotebookDropdown';
