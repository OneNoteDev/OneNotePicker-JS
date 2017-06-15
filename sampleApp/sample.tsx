import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {OneNotePicker} from '../src/oneNotePicker';
import {GlobalProps} from '../src/props/globalProps';
import {OneNoteDataProvider} from '../src/providers/oneNoteDataProvider';
import {Notebook} from '../src/oneNoteDataStructures/notebook';
import {OneNoteItemUtils} from '../src/oneNoteDataStructures/oneNoteItemUtils';
import {NotebookListUpdater} from '../src/oneNoteDataStructures/notebookListUpdater';
import {SampleOneNoteDataProvider} from './sampleOneNoteDataProvider';

let oneNoteDataProvider: OneNoteDataProvider = new SampleOneNoteDataProvider();

let render = (globalProps: GlobalProps, notebooks: Notebook[]) => {
	ReactDOM.render(
		<OneNotePicker globals={globalProps.globals} notebooks={notebooks}/>,
		document.getElementById('oneNotePicker') as HTMLElement
	);
};

oneNoteDataProvider.getNotebooks().then((notebooks) => {
	for (let i = 0; i < notebooks.length; i++) {
		OneNoteItemUtils.prune(notebooks[i]);
	}

	let updater = new NotebookListUpdater(notebooks);

	let initialSelectedId = '0-752C1AAF7737895C!515';
	OneNoteItemUtils.expandTo(notebooks, item => item.id === initialSelectedId);

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

					console.log(breadcrumbs.map(x => x.name).join(' > '));

					render(globalProps, globalProps.globals.notebookListUpdater.get());
				},
				onPageSelected: (page, breadcrumbs) => {
					globalProps.globals.selectedId = page.id;

					console.log(breadcrumbs.map(x => x.name).join(' > '));

					render(globalProps, globalProps.globals.notebookListUpdater.get());
				}
			},
			selectedId: initialSelectedId
		}
	};
	render(globalProps, notebooks);
}).catch((value) => {
	console.error(value);
});


