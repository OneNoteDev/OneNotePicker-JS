import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { OneNotePicker } from '../src/oneNotePicker';
import { GlobalProps } from '../src/props/globalProps';
import { OneNoteDataProvider } from '../src/providers/oneNoteDataProvider';
import { Notebook } from '../src/oneNoteDataStructures/notebook';
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

const renderDropdown = (globalProps: GlobalProps, notebooks: Notebook[], label: string, popupVisible: boolean) => {
	ReactDOM.render(
		<OneNotePickerDropdown globals={globalProps.globals} notebooks={notebooks} dropdownLabel={label} popupDirection={'bottom'} popupVisible={popupVisible}/>,
		document.getElementById('oneNotePickerDropdown') as HTMLElement
	);
};

export let defaultDropdownLabel = "";

oneNoteDataProvider.getNotebooks().then((notebooks) => {
	for (let i = 0; i < notebooks.length; i++) {
		OneNoteItemUtils.prune(notebooks[i]);
	}

	const updater = new NotebookListUpdater(notebooks);

	const initialSelectedId = '0-752C1AAF7737895C!515';
	OneNoteItemUtils.expandTo(notebooks, item => item.id === initialSelectedId);

	const globalProps: GlobalProps = {
		globals: {
			focusOnMount: true,
			oneNoteDataProvider: oneNoteDataProvider,
			notebookListUpdater: updater,
			callbacks: {
				onNotebookHierarchyUpdated: (newNotebookHierarchy) => {
					let latestNotebook = newNotebookHierarchy[newNotebookHierarchy.length - 1].name;
					if(defaultDropdownLabel === "")
						defaultDropdownLabel = latestNotebook; 
					render(globalProps, newNotebookHierarchy);
					renderDropdown(globalProps, newNotebookHierarchy, defaultDropdownLabel, true);
				},
				onSectionSelected: (section, breadcrumbs) => {
					globalProps.globals.selectedId = section.id;
					defaultDropdownLabel = section.name; 
					// tslint:disable-next-line:no-console
					console.log(breadcrumbs.map(x => x.name).join(' > '));

					render(globalProps, globalProps.globals.notebookListUpdater!.get());
					renderDropdown(globalProps, globalProps.globals.notebookListUpdater!.get(),  defaultDropdownLabel, false);
				},
				onPageSelected: (page, breadcrumbs) => {
					globalProps.globals.selectedId = page.id;
					defaultDropdownLabel = page.name;
					// tslint:disable-next-line:no-console
					console.log(breadcrumbs.map(x => x.name).join(' > '));
					console.log(breadcrumbs[breadcrumbs.length -1].name)

					render(globalProps, globalProps.globals.notebookListUpdater!.get());
					renderDropdown(globalProps, globalProps.globals.notebookListUpdater!.get(), defaultDropdownLabel, false);
				},
				onAccessibleSelection: (selectedItemId: string) => {
					globalProps.globals.ariaSelectedId = selectedItemId;
					let notebookName = findNotebook(notebooks, selectedItemId);
					if(defaultDropdownLabel === "")
						defaultDropdownLabel = notebookName; 
					// todo this changes the label but you can't click to make a selection?
					render(globalProps, globalProps.globals.notebookListUpdater!.get());
					renderDropdown(globalProps, globalProps.globals.notebookListUpdater!.get(), defaultDropdownLabel, true);
				}
			},
			selectedId: initialSelectedId,
			ariaSelectedId: initialSelectedId
		}
	};
	let notebookName = findNotebook(notebooks, initialSelectedId)
	render(globalProps, notebooks);
	renderDropdown(globalProps, notebooks, notebookName, false);
}).catch((value) => {
	// tslint:disable-next-line:no-console
	console.error(value);
});

export function findNotebook(notebooks, itemid) {
	let notebook = OneNoteItemUtils.find(notebooks, item => item.id === itemid);
	return notebook ? notebook.name : "";
}