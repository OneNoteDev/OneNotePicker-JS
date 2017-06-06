import * as React from 'react';

import './oneNotePicker.scss';

import {NotebookNode} from './components/notebookNode';
import {ExpandableNode} from './components/treeView/expandableNode';
import {ExpandableNodeRenderStrategy} from './components/treeView/expandableNodeRenderStrategy';
import {GlobalProps} from './props/globalProps';
import {Notebook} from './oneNoteDataStructures/notebook';

export interface OneNotePickerProps extends GlobalProps {
	notebooks: Notebook[];
}

export class OneNotePicker extends React.Component<OneNotePickerProps, null> {
	render() {
		let notebookRenderStrategies: ExpandableNodeRenderStrategy[] = this.props.notebooks.map(notebook => new NotebookNode(notebook, this.props.globals));
		return (
			<div className='onenote-picker ms-fontColor-themePrimary'>
				<ul role='tree' className='menu-list picker-list-header'>
					{notebookRenderStrategies.map((renderStrategy, i) =>
						<ExpandableNode expanded={renderStrategy.isExpanded()} node={renderStrategy}
							treeViewId={'oneNotePicker'} key={renderStrategy.getId()}
							id={renderStrategy.getId()} tabbable={i === 0}></ExpandableNode>)}
				</ul>
			</div>
		);
	}
}
