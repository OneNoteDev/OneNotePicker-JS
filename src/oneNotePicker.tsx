import * as React from 'react';
import NotebookItem from './components/notebookItem';

class OneNotePicker extends React.Component<{ notebooks: OneNoteApi.Notebook[] }, null> {
	render() {
		return (
			<div className='ms-fontColor-themePrimary'>
				<ul className='menu-list picker-list-header'>
					{this.props.notebooks.map(notebook => <NotebookItem notebook={notebook} key={notebook.name}></NotebookItem>)}
				</ul>
			</div>
		);
	}
}

export default OneNotePicker;
