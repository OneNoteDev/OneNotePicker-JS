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

	it('should not preserve the old hierarchy if a new notebook matches an old one', () => {
		let oldNotebooks = [{
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [{
				id: 'sg1',
				name: 'Section Group 1',
				expanded: true,
				sectionGroups: [],
				sections: []
			}],
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

		expect(notebookListUpdater.get()).toEqual(newNotebooks);
	});

	it('should not preserve the old hierarchy if a new notebook matches an old one and the new hierarchy is non-empty', () => {
		let oldNotebooks = [{
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [{
				id: 'sg1',
				name: 'Section Group 1',
				expanded: true,
				sectionGroups: [],
				sections: []
			}],
			sections: []
		}];
		let notebookListUpdater = new NotebookListUpdater(oldNotebooks);

		let newNotebooks = [{
			id: 'id1',
			name: 'Notebook 1',
			expanded: false,
			sectionGroups: [{
				id: 'sg1',
				name: 'Newly Renamed',
				expanded: true,
				sectionGroups: [],
				sections: []
			}],
			sections: []
		}];
		notebookListUpdater.updateNotebookList(newNotebooks);

		expect(notebookListUpdater.get()).toEqual(newNotebooks);
	});

	it('should preserve the old expanded property throughout the notebook hierarchy', () => {
		let oldNotebooks = [{
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [{
				id: 'sg1',
				name: 'Section Group 1',
				expanded: false,
				sectionGroups: [],
				sections: [{
					id: 's1',
					name: 'Section 1',
					expanded: false,
					pages: []
				}]
			}],
			sections: [{
				id: 's2',
				name: 'Section 2',
				expanded: true,
				pages: []
			}]
		}];
		let notebookListUpdater = new NotebookListUpdater(oldNotebooks);

		let newNotebooks = [{
			id: 'id1',
			name: 'Notebook 1',
			expanded: false,
			sectionGroups: [{
				id: 'sg1',
				name: 'Section Group 1',
				expanded: true,
				sectionGroups: [],
				sections: [{
					id: 's1',
					name: 'Section 1',
					expanded: false,
					pages: []
				}]
			}],
			sections: [{
				id: 's2',
				name: 'Section 2',
				expanded: false,
				pages: []
			}]
		}];
		notebookListUpdater.updateNotebookList(newNotebooks);

		expect(notebookListUpdater.get()).toEqual(oldNotebooks);
	});

	it('should update pages correctly if it was previously undefined', () => {
		let oldHierarchy = [{
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [{
				id: 's1',
				name: 'Section 1',
				expanded: true,
				pages: undefined
			}]
		}];
		let notebookListUpdater = new NotebookListUpdater(oldHierarchy);

		let pages = [{
			id: 'p1',
			title: 'Page 1'
		}, {
			id: 'p2',
			title: 'Page 2'
		}];
		notebookListUpdater.updatePages('s1', pages);

		let expectedHierarchy = [{
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [{
				id: 's1',
				name: 'Section 1',
				expanded: true,
				pages: pages
			}]
		}];
		expect(notebookListUpdater.get()).toEqual(expectedHierarchy);
	});

	it('should update pages correctly if it was previously undefined and there are no new pages', () => {
		let oldHierarchy = [{
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [{
				id: 's1',
				name: 'Section 1',
				expanded: true,
				pages: undefined
			}]
		}];
		let notebookListUpdater = new NotebookListUpdater(oldHierarchy);

		let pages = [];
		notebookListUpdater.updatePages('s1', pages);

		let expectedHierarchy = [{
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [{
				id: 's1',
				name: 'Section 1',
				expanded: true,
				pages: pages
			}]
		}];
		expect(notebookListUpdater.get()).toEqual(expectedHierarchy);
	});

	it('should update pages correctly if if the section is not in the first level of the hierarchy', () => {
		let oldHierarchy = [{
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [{
				id: 'sg1',
				name: 'Section Group 1',
				expanded: true,
				sectionGroups: [],
				sections: [{
					id: 's1',
					name: 'Section 1',
					expanded: true,
					pages: undefined
				}]
			}],
			sections: [{
				id: 's2',
				name: 'Section 2',
				expanded: true,
				pages: undefined
			}]
		}];
		let notebookListUpdater = new NotebookListUpdater(oldHierarchy);

		let pages = [];
		notebookListUpdater.updatePages('s1', pages);

		let expectedHierarchy = [{
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [{
				id: 'sg1',
				name: 'Section Group 1',
				expanded: true,
				sectionGroups: [],
				sections: [{
					id: 's1',
					name: 'Section 1',
					expanded: true,
					pages: pages
				}]
			}],
			sections: [{
				id: 's2',
				name: 'Section 2',
				expanded: true,
				pages: undefined
			}]
		}];
		expect(notebookListUpdater.get()).toEqual(expectedHierarchy);
	});

	it('should update pages correctly if the parent section is not in the first notebook', () => {
		let oldHierarchy = [{
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [{
				id: 's1',
				name: 'Section 1',
				expanded: true,
				pages: undefined
			}]
		}, {
			id: 'id2',
			name: 'Notebook 2',
			expanded: true,
			sectionGroups: [],
			sections: [{
				id: 's2',
				name: 'Section 2',
				expanded: true,
				pages: undefined
			}]
		}];
		let notebookListUpdater = new NotebookListUpdater(oldHierarchy);

		let pages = [{
			id: 'p1',
			title: 'Page 1'
		}, {
			id: 'p2',
			title: 'Page 2'
		}];
		notebookListUpdater.updatePages('s2', pages);

		let expectedHierarchy = [{
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [{
				id: 's1',
				name: 'Section 1',
				expanded: true,
				pages: undefined
			}]
		}, {
			id: 'id2',
			name: 'Notebook 2',
			expanded: true,
			sectionGroups: [],
			sections: [{
				id: 's2',
				name: 'Section 2',
				expanded: true,
				pages: pages
			}]
		}];
		expect(notebookListUpdater.get()).toEqual(expectedHierarchy);
	});

	it('should not update the notebook hierarchy if the section has not been found', () => {
		let oldHierarchy = [];
		let notebookListUpdater = new NotebookListUpdater(oldHierarchy);

		let pages = [{
			id: 'p1',
			title: 'Page 1'
		}, {
			id: 'p2',
			title: 'Page 2'
		}];
		notebookListUpdater.updatePages('s1', pages);

		expect(notebookListUpdater.get()).toEqual(oldHierarchy);
	});
});
