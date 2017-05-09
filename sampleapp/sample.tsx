import * as React from 'react';
import * as ReactDOM from 'react-dom';

import OneNotePicker from '../src/oneNotePicker';
import GlobalProps from '../src/props/globalProps';
import OneNoteDataProvider from '../src/providers/oneNoteDataProvider';
import NotebookListUpdater from '../src/oneNoteDataStructures/notebookListUpdater';
import SampleOneNoteDataProvider from './sampleOneNoteDataProvider';

let oneNoteDataProvider: OneNoteDataProvider = new SampleOneNoteDataProvider();

oneNoteDataProvider.getNotebooks().then((notebooks) => {
	let updater = new NotebookListUpdater(notebooks);

	let globalProps: GlobalProps = {
		globals: {
			oneNoteDataProvider: oneNoteDataProvider,
			notebookListUpdater: updater,
			callbacks: {
				onNotebookHierarchyUpdated: (newNotebookHierarchy) => {
					ReactDOM.render(
						<OneNotePicker globals={globalProps.globals} notebooks={newNotebookHierarchy} />,
						document.getElementById('oneNotePicker') as HTMLElement
					);
				},
				onNotebookSelected: (notebook) => { console.log(notebook.id); },
				onSectionSelected: (section) => { console.log(section.id); },
				onPageSelected: (page) => { console.log(page.id); }
			},
			selectedId: undefined
		}
	};
	ReactDOM.render(
		<OneNotePicker globals={globalProps.globals} notebooks={notebooks} />,
		document.getElementById('oneNotePicker') as HTMLElement
	);
}).catch((value) => {
	console.error(value);
});


