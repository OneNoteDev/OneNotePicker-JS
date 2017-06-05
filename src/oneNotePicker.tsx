import * as React from 'react';

import './oneNotePicker.scss';

import {NotebookNode} from './components/notebookNode';
import {ExpandableNode} from './components/treeView/expandableNode';
import {GlobalProps} from './props/globalProps';
import {Notebook} from './oneNoteDataStructures/notebook';

export interface OneNotePickerProps extends GlobalProps {
	notebooks: Notebook[];
}

export class OneNotePicker extends React.Component<OneNotePickerProps, null> {
	render() {
		let notebookNodes: NotebookNode[] = this.props.notebooks.map(notebook => new NotebookNode(notebook, this.props.globals));

		return (
			<div className='onenote-picker ms-fontColor-themePrimary'>
				<ul role='tree' className='menu-list picker-list-header'>
					{notebookNodes.map(notebook => <ExpandableNode expanded={notebook.isExpanded()} node={notebook}
														treeViewId={notebook.getName()} key={notebook.getKey()}></ExpandableNode>)}
				</ul>
			</div>
		);
	}
}
