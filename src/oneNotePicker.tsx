import * as React from 'react';

import './oneNotePicker.scss';

import NotebookItem from './components/notebookItem';
import GlobalProps from './props/globalProps';
import Notebook from './oneNoteDataStructures/notebook';

interface OneNotePickerProps extends GlobalProps {
	notebooks: Notebook[];
}

class OneNotePicker extends React.Component<OneNotePickerProps, null> {
	render() {
		return (
			<div className='onenote-picker ms-fontColor-themePrimary'>
				<ul role='tree' className='menu-list picker-list-header'>
					{this.props.notebooks.map(notebook => <NotebookItem globals={this.props.globals} notebook={notebook} key={notebook.name}></NotebookItem>)}
				</ul>
			</div>
		);
	}
}

export default OneNotePicker;
