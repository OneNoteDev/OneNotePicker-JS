import * as React from 'react';
import * as ReactDOM from 'react-dom';

import OneNotePicker from '../src/oneNotePicker';
import GlobalProps from '../src/props/globalProps';
import OneNoteDataProvider from '../src/providers/oneNoteDataProvider';
import Notebook from '../src/oneNoteDataStructures/notebook';
import NotebookListUpdater from '../src/oneNoteDataStructures/notebookListUpdater';
import SampleOneNoteDataProvider from './sampleOneNoteDataProvider';

let oneNoteDataProvider: OneNoteDataProvider = new SampleOneNoteDataProvider();

let render = (globalProps: GlobalProps, notebooks: Notebook[]) => {
	ReactDOM.render(
		<OneNotePicker globals={globalProps.globals} notebooks={notebooks} />,
		document.getElementById('oneNotePicker') as HTMLElement
	);
};

oneNoteDataProvider.getNotebooks().then((notebooks) => {
	let updater = new NotebookListUpdater(notebooks);

	let globalProps: GlobalProps = {
		globals: {
			oneNoteDataProvider: oneNoteDataProvider,
			notebookListUpdater: updater,
			callbacks: {
				onNotebookHierarchyUpdated: (newNotebookHierarchy) => {
					render(globalProps, newNotebookHierarchy);
				},
				onSectionSelected: (section) => {
					globalProps.globals.selectedId = section.id;
					render(globalProps, globalProps.globals.notebookListUpdater.get());
				},
				onPageSelected: (page) => { }
			},
			selectedId: undefined
		}
	};
	render(globalProps, notebooks);
}).catch((value) => {
	console.error(value);
});


