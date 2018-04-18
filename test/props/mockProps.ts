import { NotebookListUpdater } from '../../src/oneNoteDataStructures/notebookListUpdater';
import { Notebook } from '../../src/oneNoteDataStructures/notebook';
import { GlobalProps } from '../../src/props/globalProps';
import { OneNoteApiDataProvider } from '../../src/providers/oneNoteApiDataProvider';

import * as sinon from 'sinon';

export class MockProps {
	static getGlobalProps(notebooks: Notebook[]): GlobalProps {
		// tslint:disable-next-line:no-any
		const oneNoteDataProvider: OneNoteApiDataProvider = sinon.mock(OneNoteApiDataProvider) as any;
		const updater = new NotebookListUpdater(notebooks);

		return {
			globals: {
				focusOnMount: false,
				oneNoteDataProvider: oneNoteDataProvider,
				notebookListUpdater: updater,
				callbacks: {
					onNotebookHierarchyUpdated: () => { },
					onNotebookSelected: () => { },
					onSectionSelected: () => { },
					onPageSelected: () => { },
					onAccessibleSelection: () => { }
				},
				selectedId: undefined
			}
		};
	}
}
