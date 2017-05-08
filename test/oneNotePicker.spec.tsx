import NotebookListUpdater from '../src/oneNoteDataStructures/notebookListUpdater';
import OneNoteApiResponseTransformer from '../src/oneNoteDataStructures/oneNoteApiResponseTransformer';
import GlobalProps from '../src/props/globalProps';
import OneNoteApiDataProvider from '../src/providers/oneNoteApiDataProvider';

import { render } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import OneNotePicker from '../src/oneNotePicker';

describe('OneNotePickerComponent', () => {
	it('should compile', () => {
		let notebooks = [];
		let oneNoteDataProvider: OneNoteApiDataProvider = sinon.mock(OneNoteApiDataProvider) as any;
		let oneNoteApiResponseTransformer: OneNoteApiResponseTransformer = sinon.mock(OneNoteApiResponseTransformer) as any;
		let updater = new NotebookListUpdater(oneNoteApiResponseTransformer, notebooks);
		let globalProps: GlobalProps = {
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

		let app = render(<OneNotePicker globals={globalProps.globals} notebooks={notebooks} />);
		expect(app.find('.menu-list').length).toBe(1);
	});
});
