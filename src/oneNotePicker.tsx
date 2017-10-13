import * as React from 'react';

import './oneNotePicker.scss';

import {Constants} from './constants';
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
	render() {
		let notebookRenderStrategies: ExpandableNodeRenderStrategy[] =
			this.props.notebooks.map(notebook => new NotebookRenderStrategy(notebook, this.props.globals));
		
		let sharedNotebookRenderStrategies: ExpandableNodeRenderStrategy[] = this.props.sharedNotebooks ?
			this.props.sharedNotebooks.map(sharedNotebook => new SharedNotebookRenderStrategy(sharedNotebook, this.props.globals)) : [];
		
		return (
			<div className='onenote-picker ms-fontColor-themePrimary'>
				<ul role='tree' className='menu-list picker-list-header'>
					{notebookRenderStrategies.map((renderStrategy, i) =>
						!!this.props.globals.callbacks.onSectionSelected || !!this.props.globals.callbacks.onPageSelected ?
							<ExpandableNode expanded={renderStrategy.isExpanded()} node={renderStrategy}
								treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
								id={renderStrategy.getId()} tabbable={i === 0}></ExpandableNode> :
							<LeafNode node={renderStrategy} treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
								id={renderStrategy.getId()} tabbable={i === 0}></LeafNode>)}
					{sharedNotebookRenderStrategies.map((renderStrategy, i) =>
						!!this.props.globals.callbacks.onSectionSelected || !!this.props.globals.callbacks.onPageSelected ?
							<ExpandableNode expanded={renderStrategy.isExpanded()} node={renderStrategy}
								treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
								id={renderStrategy.getId()} tabbable={i === 0}></ExpandableNode> :
							<LeafNode node={renderStrategy} treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
								id={renderStrategy.getId()} tabbable={i === 0}></LeafNode>)}
				</ul>
			</div>
		);
	}
}
