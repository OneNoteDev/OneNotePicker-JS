import * as React from 'react';

import './oneNotePicker.scss';

import {Constants} from './constants';
import {NotebookRenderStrategy} from './components/notebookRenderStrategy';
import {ExpandableNode} from './components/treeView/expandableNode';
import {ExpandableNodeRenderStrategy} from './components/treeView/expandableNodeRenderStrategy';
import {GlobalProps} from './props/globalProps';
import {Notebook} from './oneNoteDataStructures/notebook';

export interface OneNotePickerProps extends GlobalProps {
	notebooks: Notebook[];
}

export class OneNotePicker extends React.Component<OneNotePickerProps, null> {
	render() {
		let notebookRenderStrategies: ExpandableNodeRenderStrategy[] =
			this.props.notebooks.map(notebook => new NotebookRenderStrategy(notebook, this.props.globals));
		return (
			<div className='onenote-picker ms-fontColor-themePrimary'>
				<ul role='tree' className='menu-list picker-list-header'>
					{notebookRenderStrategies.map((renderStrategy, i) =>
						<ExpandableNode expanded={renderStrategy.isExpanded()} node={renderStrategy}
							treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
							id={renderStrategy.getId()} tabbable={i === 0}></ExpandableNode>)}
				</ul>
			</div>
		);
	}
}
