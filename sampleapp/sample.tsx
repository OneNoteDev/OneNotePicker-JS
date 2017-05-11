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
				onSectionSelected: (section, breadcrumbs) => {
					globalProps.globals.selectedId = section.id;

					console.log('Notebook: ' + breadcrumbs[0].name + ', Section: ' + section.name);

					render(globalProps, globalProps.globals.notebookListUpdater.get());
				},
				onPageSelected: (page, breadcrumbs) => {
					globalProps.globals.selectedId = page.id;

					console.log('Notebook: ' + breadcrumbs[0].name + ', Page: ' + page.name);

					render(globalProps, globalProps.globals.notebookListUpdater.get());
				}
			},
			selectedId: undefined
		}
	};
	render(globalProps, notebooks);
}).catch((value) => {
	console.error(value);
});


