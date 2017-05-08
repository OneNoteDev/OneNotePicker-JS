import NotebookListUpdater from '../../src/oneNoteDataStructures/notebookListUpdater';
import Notebook from '../../src/oneNoteDataStructures/notebook';
import OneNoteApiResponseTransformer from '../../src/oneNoteDataStructures/oneNoteApiResponseTransformer';
import GlobalProps from '../../src/props/globalProps';
import OneNoteApiDataProvider from '../../src/providers/oneNoteApiDataProvider';

import * as sinon from 'sinon';

class MockProps {
	static getGlobalProps(notebooks: Notebook[]): GlobalProps {
		let oneNoteDataProvider: OneNoteApiDataProvider = sinon.mock(OneNoteApiDataProvider) as any;
		let oneNoteApiResponseTransformer: OneNoteApiResponseTransformer = sinon.mock(OneNoteApiResponseTransformer) as any;
		let updater = new NotebookListUpdater(oneNoteApiResponseTransformer, notebooks);

		return {
			globals: {
				oneNoteDataProvider: oneNoteDataProvider,
				notebookListUpdater: updater,
				callbacks: {
					onNotebookHierarchyUpdated: () => {},
					onSectionSelected: () => {},
					onPageSelected: () => {}
				},
				selectedId: undefined
			}
		};
	}
}

export default MockProps;
