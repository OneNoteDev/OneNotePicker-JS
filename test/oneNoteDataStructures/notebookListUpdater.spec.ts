import {Notebook} from '../../src/oneNoteDataStructures/notebook';
import {SectionGroup} from '../../src/oneNoteDataStructures/sectionGroup';
import {NotebookListUpdater} from '../../src/oneNoteDataStructures/notebookListUpdater';

describe('NotebookListUpdater', () => {
	it('should return the notebooks in the getter with the notebooks it was initialized with', () => {
		let notebooks = [{
			parent: undefined,
			id: 'id',
			name: 'Default Notebook',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
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
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
		}];
		let notebookListUpdater = new NotebookListUpdater(oldNotebooks);

		let newNotebooks = [{
			parent: undefined,
			id: 'id2',
			name: 'Notebook 2',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
		}];
		notebookListUpdater.updateNotebookList(newNotebooks);

		expect(notebookListUpdater.get()).toEqual(newNotebooks);
	});

	it('should return the new notebooks in the getter after an update call if the old notebooks was empty', () => {
		let oldNotebooks = [];
		let notebookListUpdater = new NotebookListUpdater(oldNotebooks);

		let newNotebooks = [{
			parent: undefined,
			id: 'id2',
			name: 'Notebook 2',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
		}];
		notebookListUpdater.updateNotebookList(newNotebooks);

		expect(notebookListUpdater.get()).toEqual(newNotebooks);
	});

	it('should return the new notebooks in the getter as an empty list if the update was called with an empty list', () => {
		let oldNotebooks = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
		}];
		let notebookListUpdater = new NotebookListUpdater(oldNotebooks);

		let newNotebooks = [];
		notebookListUpdater.updateNotebookList(newNotebooks);

		expect(notebookListUpdater.get()).toEqual(newNotebooks);
	});

	it('should preserve the notebooks if the new notebooks is the same as the old', () => {
		let notebooks = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
		}];
		let notebookListUpdater = new NotebookListUpdater(notebooks);

		notebookListUpdater.updateNotebookList(notebooks);

		expect(notebookListUpdater.get()).toEqual(notebooks);
	});

	it('should preserve the old expanded property if a new notebook matches an old one', () => {
		let oldNotebooks = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
		}];
		let notebookListUpdater = new NotebookListUpdater(oldNotebooks);

		let newNotebooks = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
		}];
		notebookListUpdater.updateNotebookList(newNotebooks);

		expect(notebookListUpdater.get()).toEqual(oldNotebooks);
	});

	it('should not preserve the old hierarchy if a new notebook matches an old one', () => {
		let oldNotebooks: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
		}];

		oldNotebooks[0].sectionGroups.push({
			parent: oldNotebooks[0],
			id: 'sg1',
			name: 'Section Group 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
		});

		let notebookListUpdater = new NotebookListUpdater(oldNotebooks);

		let newNotebooks = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
		}];
		notebookListUpdater.updateNotebookList(newNotebooks);

		expect(notebookListUpdater.get()).toEqual(newNotebooks);
	});

	it('should not preserve the old hierarchy if a new notebook matches an old one and the new hierarchy is non-empty', () => {
		let oldNotebooks: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
		}];

		oldNotebooks[0].sectionGroups.push({
			parent: oldNotebooks[0],
			id: 'sg1',
			name: 'Section Group 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
		});

		let notebookListUpdater = new NotebookListUpdater(oldNotebooks);

		let newNotebooks: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
		}];

		newNotebooks[0].sectionGroups.push({
			parent: newNotebooks[0],
			id: 'sg1',
			name: 'Newly Renamed',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
		});

		notebookListUpdater.updateNotebookList(newNotebooks);

		expect(notebookListUpdater.get()).toEqual(newNotebooks);
	});

	it('should preserve the old expanded property throughout the notebook hierarchy', () => {
		let oldNotebooks: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
		}];

		oldNotebooks[0].sections.push({
			parent: oldNotebooks[0],
			id: 's2',
			name: 'Section 2',
			expanded: true,
			pages: [],
			apiUrl: '',
		});

		let oldSectionGroup: SectionGroup = {
			parent: oldNotebooks[0],
			id: 'sg1',
			name: 'Section Group 1',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
		};

		oldSectionGroup.sections.push({
			parent: oldSectionGroup,
			id: 's1',
			name: 'Section 1',
			expanded: false,
			pages: [],
			apiUrl: '',
		});

		oldNotebooks[0].sectionGroups.push(oldSectionGroup);

		let notebookListUpdater = new NotebookListUpdater(oldNotebooks);

		let newNotebooks: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
		}];

		newNotebooks[0].sections.push({
			parent: newNotebooks[0],
			id: 's2',
			name: 'Section 2',
			expanded: false,
			pages: [],
			apiUrl: '',
		});

		let newSectionGroup: SectionGroup = {
			parent: newNotebooks[0],
			id: 'sg1',
			name: 'Section Group 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
		};

		newSectionGroup.sections.push({
			parent: newSectionGroup,
			id: 's1',
			name: 'Section 1',
			expanded: false,
			pages: [],
			apiUrl: '',
		});

		newNotebooks[0].sectionGroups.push(newSectionGroup);

		notebookListUpdater.updateNotebookList(newNotebooks);

		expect(notebookListUpdater.get()).toEqual(oldNotebooks);
	});

	it('should update pages correctly if it was previously undefined', () => {
		let oldHierarchy: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
		}];

		oldHierarchy[0].sections.push({
			parent: oldHierarchy[0],
			id: 's1',
			name: 'Section 1',
			expanded: true,
			pages: undefined,
			apiUrl: '',
		});

		let notebookListUpdater = new NotebookListUpdater(oldHierarchy);

		let pages = [{
			parent: oldHierarchy[0].sections[0],
			id: 'p1',
			name: 'Page 1',
			webUrl: '',
			apiUrl: '',
		}, {
			parent: oldHierarchy[0].sections[0],
			id: 'p2',
			name: 'Page 2',
			webUrl: '',
			apiUrl: '',
		}];
		notebookListUpdater.updatePages('s1', pages);

		let expectedHierarchy: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
		}];

		expectedHierarchy[0].sections.push({
			parent: expectedHierarchy[0],
			id: 's1',
			name: 'Section 1',
			expanded: true,
			pages: pages,
			apiUrl: '',
		});

		expect(notebookListUpdater.get()).toEqual(expectedHierarchy);
	});

	it('should update pages correctly if it was previously undefined and there are no new pages', () => {
		let oldHierarchy: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
		}];

		oldHierarchy[0].sections.push({
			parent: oldHierarchy[0],
			id: 's1',
			name: 'Section 1',
			expanded: true,
			pages: undefined,
			apiUrl: '',
		});

		let notebookListUpdater = new NotebookListUpdater(oldHierarchy);

		let pages = [];
		notebookListUpdater.updatePages('s1', pages);

		let expectedHierarchy: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
		}];

		expectedHierarchy[0].sections.push({
			parent: expectedHierarchy[0],
			id: 's1',
			name: 'Section 1',
			expanded: true,
			pages: pages,
			apiUrl: '',
		});

		expect(notebookListUpdater.get()).toEqual(expectedHierarchy);
	});

	it('should update pages correctly if if the section is not in the first level of the hierarchy', () => {
		let oldHierarchy: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
		}];

		let oldSectionGroup: SectionGroup = {
			parent: oldHierarchy[0],
			id: 'sg1',
			name: 'Section Group 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
		};

		oldSectionGroup.sections.push({
			parent: oldSectionGroup,
			id: 's1',
			name: 'Section 1',
			expanded: true,
			pages: undefined,
			apiUrl: '',
		});

		oldHierarchy[0].sectionGroups.push(oldSectionGroup);

		oldHierarchy[0].sections.push({
			parent: oldHierarchy[0],
			id: 's2',
			name: 'Section 2',
			expanded: true,
			pages: undefined,
			apiUrl: '',
		});

		let notebookListUpdater = new NotebookListUpdater(oldHierarchy);

		let pages = [];
		notebookListUpdater.updatePages('s1', pages);

		let expectedHierarchy: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
		}];

		let newSectionGroup: SectionGroup = {
			parent: expectedHierarchy[0],
			id: 'sg1',
			name: 'Section Group 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
		};

		newSectionGroup.sections.push({
			parent: newSectionGroup,
			id: 's1',
			name: 'Section 1',
			expanded: true,
			pages: pages,
			apiUrl: '',
		});

		expectedHierarchy[0].sectionGroups.push(newSectionGroup);

		expectedHierarchy[0].sections.push({
			parent: expectedHierarchy[0],
			id: 's2',
			name: 'Section 2',
			expanded: true,
			pages: undefined,
			apiUrl: '',
		});

		expect(notebookListUpdater.get()).toEqual(expectedHierarchy);
	});

	it('should update pages correctly if the parent section is not in the first notebook', () => {
		let oldHierarchy: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			webUrl: '',
			apiUrl: '',
		}, {
			parent: undefined,
			id: 'id2',
			name: 'Notebook 2',
			expanded: true,
			sectionGroups: [],
			sections: [],
			webUrl: '',
			apiUrl: '',
		}];

		oldHierarchy[0].sections.push({
			parent: oldHierarchy[0],
			id: 's1',
			name: 'Section 1',
			expanded: true,
			pages: undefined,
			apiUrl: '',
		});

		oldHierarchy[1].sections.push({
			parent: oldHierarchy[1],
			id: 's2',
			name: 'Section 2',
			expanded: true,
			pages: undefined,
			apiUrl: '',
		});

		let notebookListUpdater = new NotebookListUpdater(oldHierarchy);

		let pages = [{
			parent: oldHierarchy[1].sections[0],
			id: 'p1',
			name: 'Page 1',
			webUrl: '',
			apiUrl: '',
		}, {
			parent: oldHierarchy[1].sections[0],
			id: 'p2',
			name: 'Page 2',
			webUrl: '',
			apiUrl: '',
		}];
		notebookListUpdater.updatePages('s2', pages);

		let expectedHierarchy: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			webUrl: '',
			apiUrl: '',
		}, {
			parent: undefined,
			id: 'id2',
			name: 'Notebook 2',
			expanded: true,
			sectionGroups: [],
			sections: [],
			webUrl: '',
			apiUrl: '',
		}];

		expectedHierarchy[0].sections.push({
			parent: expectedHierarchy[0],
			id: 's1',
			name: 'Section 1',
			expanded: true,
			pages: undefined,
			apiUrl: '',
		});

		expectedHierarchy[1].sections.push({
			parent: expectedHierarchy[1],
			id: 's2',
			name: 'Section 2',
			expanded: true,
			pages: pages,
			apiUrl: '',
		});
		expect(notebookListUpdater.get()).toEqual(expectedHierarchy);
	});
});
