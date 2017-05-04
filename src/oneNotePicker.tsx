import * as React from 'react';

import NotebookItem from './components/notebookItem';
import GlobalProps from './props/globalProps';

interface OneNotePickerProps extends GlobalProps {
	notebooks: OneNoteApi.Notebook[];
}

class OneNotePicker extends React.Component<OneNotePickerProps, null> {
	render() {
		return (
			<ul className={'menu-list'}>
				{this.props.notebooks.map(notebook => <NotebookItem globals={this.props.globals} notebook={notebook} key={notebook.name}></NotebookItem>)}
			</ul>
		);
	}
}

export default OneNotePicker;
