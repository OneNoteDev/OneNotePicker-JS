import NotebookListUpdater from '../../src/oneNoteDataStructures/notebookListUpdater';

describe('NotebookListUpdater', () => {
	it('should return the notebooks in the getter with the notebooks it was initialized with', () => {
		let notebooks = [{
			id: 'id',
			name: 'Default Notebook',
			expanded: false,
			sectionGroups: [],
			sections: []
		}];
		let notebookListUpdater = new NotebookListUpdater(notebooks);
		expect(notebookListUpdater.get()).toBe(notebooks);
	});

	it('should return the empty notebooks in the getter if it has been initialized with it', () => {
		let notebooks = [];
		let notebookListUpdater = new NotebookListUpdater(notebooks);
		expect(notebookListUpdater.get()).toEqual(notebooks);
	});

	it('should not preserve old notebooks that no longer exist', () => {
		let oldNotebooks = [{
			id: 'id1',
			name: 'Notebook 1',
			expanded: false,
			sectionGroups: [],
			sections: []
		}];
		let notebookListUpdater = new NotebookListUpdater(oldNotebooks);

		let newNotebooks = [{
			id: 'id2',
			name: 'Notebook 2',
			expanded: false,
			sectionGroups: [],
			sections: []
		}];
		notebookListUpdater.updateNotebookList(newNotebooks);

		expect(notebookListUpdater.get()).toEqual(newNotebooks);
	});

	it('should return the new notebooks in the getter after an update call if the old notebooks was empty', () => {
		let oldNotebooks = [];
		let notebookListUpdater = new NotebookListUpdater(oldNotebooks);

		let newNotebooks = [{
			id: 'id2',
			name: 'Notebook 2',
			expanded: false,
			sectionGroups: [],
			sections: []
		}];
		notebookListUpdater.updateNotebookList(newNotebooks);

		expect(notebookListUpdater.get()).toEqual(newNotebooks);
	});

	it('should return the new notebooks in the getter as an empty list if the update was called with an empty list', () => {
		let oldNotebooks = [{
			id: 'id1',
			name: 'Notebook 1',
			expanded: false,
			sectionGroups: [],
			sections: []
		}];
		let notebookListUpdater = new NotebookListUpdater(oldNotebooks);

		let newNotebooks = [];
		notebookListUpdater.updateNotebookList(newNotebooks);

		expect(notebookListUpdater.get()).toEqual(newNotebooks);
	});

	it('should preserve the notebooks if the new notebooks is the same as the old', () => {
		let notebooks = [{
			id: 'id1',
			name: 'Notebook 1',
			expanded: false,
			sectionGroups: [],
			sections: []
		}];
		let notebookListUpdater = new NotebookListUpdater(notebooks);

		notebookListUpdater.updateNotebookList(notebooks);

		expect(notebookListUpdater.get()).toEqual(notebooks);
	});

	it('should preserve the old expanded property if a new notebook matches an old one', () => {
		let oldNotebooks = [{
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: []
		}];
		let notebookListUpdater = new NotebookListUpdater(oldNotebooks);

		let newNotebooks = [{
			id: 'id1',
			name: 'Notebook 1',
			expanded: false,
			sectionGroups: [],
			sections: []
		}];
		notebookListUpdater.updateNotebookList(newNotebooks);

		expect(notebookListUpdater.get()).toEqual(oldNotebooks);
	});
});
