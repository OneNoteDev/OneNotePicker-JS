import {NotebookListUpdater} from '../../src/oneNoteDataStructures/notebookListUpdater';
import {Notebook} from '../../src/oneNoteDataStructures/notebook';
import {GlobalProps} from '../../src/props/globalProps';
import {OneNoteApiDataProvider} from '../../src/providers/oneNoteApiDataProvider';

import * as sinon from 'sinon';

export class MockProps {
	static getGlobalProps(notebooks: Notebook[]): GlobalProps {
		let oneNoteDataProvider: OneNoteApiDataProvider = sinon.mock(OneNoteApiDataProvider) as any;
		let updater = new NotebookListUpdater(notebooks);

		return {
			globals: {
				focusOnMount: false,
				oneNoteDataProvider: oneNoteDataProvider,
				notebookListUpdater: updater,
				callbacks: {
					onNotebookHierarchyUpdated: () => { },
					onNotebookSelected: () => { },
					onSectionSelected: () => { },
					onPageSelected: () => { }
				},
				selectedId: undefined
			}
		};
	}
}
