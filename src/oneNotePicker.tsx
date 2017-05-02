import * as React from 'react';
import NotebookItem from './components/notebookItem';

class OneNotePicker extends React.Component<{ notebooks: OneNoteApi.Notebook[] }, null> {
	render() {
		return (
			<ul className={'menu-list'}>
				{this.props.notebooks.map(notebook => <NotebookItem notebook={notebook} key={notebook.name}></NotebookItem>)}
			</ul>
		);
	}
}

export default OneNotePicker;
