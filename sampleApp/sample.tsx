import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { OneNotePicker } from '../src/oneNotePicker';
import { GlobalProps } from '../src/props/globalProps';
import { OneNoteDataProvider } from '../src/providers/oneNoteDataProvider';
import { Notebook } from '../src/oneNoteDataStructures/notebook';
import { Section } from '../src/oneNoteDataStructures/section';
import { OneNoteItemUtils } from '../src/oneNoteDataStructures/oneNoteItemUtils';
import { NotebookListUpdater } from '../src/oneNoteDataStructures/notebookListUpdater';
import { SampleOneNoteDataProvider } from './sampleOneNoteDataProvider';
import { OneNotePickerDropdown } from '../src/oneNotePickerDropdown';

const oneNoteDataProvider: OneNoteDataProvider = new SampleOneNoteDataProvider();

const render = (globalProps: GlobalProps, notebooks: Notebook[]) => {
	ReactDOM.render(
		<OneNotePicker globals={globalProps.globals} notebooks={notebooks} />,
		document.getElementById('oneNotePicker') as HTMLElement
	);
};

const renderDropdown = (globalProps: GlobalProps, notebooks: Notebook[]) => {	
	const dropdownLabel = !globalProps.globals.selectedId ?
		'Select Section' :
		findItemName(globalProps.globals.notebookListUpdater!.get(), globalProps.globals.selectedId);

	ReactDOM.render(
		<OneNotePickerDropdown globals={globalProps.globals} notebooks={notebooks} dropdownLabel={dropdownLabel} popupDirection={'bottom'} />,
		document.getElementById('oneNotePickerDropdown') as HTMLElement
	);
};


oneNoteDataProvider.getNotebooks().then((notebooks) => {
	for (let i = 0; i < notebooks.length; i++) {
		OneNoteItemUtils.prune(notebooks[i]);
	}

	const updater = new NotebookListUpdater(notebooks);

	const initialSelectedId = '0-752C1AAF7737895C!515';
	OneNoteItemUtils.expandTo(notebooks, item => item.id === initialSelectedId);
	let dropdownLabel = '';

	const globalProps: GlobalProps = {
		globals: {
			focusOnMount: true,
			oneNoteDataProvider: oneNoteDataProvider,
			notebookListUpdater: updater,
			callbacks: {
				onNotebookHierarchyUpdated: (newNotebookHierarchy) => {
				
					render(globalProps, newNotebookHierarchy);
					renderDropdown(globalProps, newNotebookHierarchy);
				},
				onSectionSelected: (section, breadcrumbs) => {
					globalProps.globals.selectedId = section.id;
			
					// tslint:disable-next-line:no-console
					console.log(breadcrumbs.map(x => x.name).join(' > '));

					render(globalProps, globalProps.globals.notebookListUpdater!.get());
					renderDropdown(globalProps, globalProps.globals.notebookListUpdater!.get());
				},
				onPageSelected: (page, breadcrumbs) => {
					globalProps.globals.selectedId = page.id;

					// tslint:disable-next-line:no-console
					console.log(breadcrumbs.map(x => x.name).join(' > '));

					render(globalProps, globalProps.globals.notebookListUpdater!.get());
					renderDropdown(globalProps, globalProps.globals.notebookListUpdater!.get());
				},
				onAccessibleSelection: (selectedItemId: string) => {
					globalProps.globals.ariaSelectedId = selectedItemId;

					// todo this changes the label but you can't click to make a selection?
					render(globalProps, globalProps.globals.notebookListUpdater!.get());
					renderDropdown(globalProps, globalProps.globals.notebookListUpdater!.get());
				},
				onNotebookCreated: (notebook: Notebook) => {
					// Allow max one creation
					globalProps.globals.callbacks.onNotebookCreated = undefined;

					if (globalProps.globals.notebookListUpdater) {
						globalProps.globals.notebookListUpdater.addNotebook(notebook);
						globalProps.globals.selectedId = notebook.id;
					}

					// tslint:disable-next-line:no-console
					console.log(`Notebook created: ${notebook.name}`);

					render(globalProps, globalProps.globals.notebookListUpdater!.get());
				},
				onSectionCreated: (section: Section) => {
					// TODO (machiam) Introduce a way of only allowing max one section creation per parent
					// tslint:disable-next-line:no-console
					console.log(`Section created: ${section.name}`);

					if (globalProps.globals.notebookListUpdater) {
						globalProps.globals.notebookListUpdater!.addSection(section);
						globalProps.globals.selectedId = section.id;
					}

					render(globalProps, globalProps.globals.notebookListUpdater!.get());
				}
			},
			selectedId: initialSelectedId,
			ariaSelectedId: initialSelectedId
		}
	};
	render(globalProps, notebooks);
	renderDropdown(globalProps, notebooks);
}).catch((value) => {
	// tslint:disable-next-line:no-console
	console.error(value);
});

export function findItemName(notebooks, itemid) {
	let notebook = OneNoteItemUtils.find(notebooks, item => item.id === itemid);
	return notebook ? notebook.name : '';
}