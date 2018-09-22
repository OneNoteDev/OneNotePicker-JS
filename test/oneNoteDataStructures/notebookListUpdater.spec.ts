import { Notebook } from '../../src/oneNoteDataStructures/notebook';
import { SectionGroup } from '../../src/oneNoteDataStructures/sectionGroup';
import { NotebookListUpdater } from '../../src/oneNoteDataStructures/notebookListUpdater';

describe('NotebookListUpdater', () => {
	it('should return the notebooks in the getter with the notebooks it was initialized with', () => {
		const notebooks = [{
			parent: undefined,
			id: 'id',
			name: 'Default Notebook',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		}];
		const notebookListUpdater = new NotebookListUpdater(notebooks);
		expect(notebookListUpdater.get()).toBe(notebooks);
	});

	it('should return the empty notebooks in the getter if it has been initialized with it', () => {
		const notebooks = [];
		const notebookListUpdater = new NotebookListUpdater(notebooks);
		expect(notebookListUpdater.get()).toEqual(notebooks);
	});

	it('should not preserve old notebooks that no longer exist', () => {
		const oldNotebooks = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		}];
		const notebookListUpdater = new NotebookListUpdater(oldNotebooks);

		const newNotebooks = [{
			parent: undefined,
			id: 'id2',
			name: 'Notebook 2',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		}];
		notebookListUpdater.updateNotebookList(newNotebooks);

		expect(notebookListUpdater.get()).toEqual(newNotebooks);
	});

	it('should return the new notebooks in the getter after an update call if the old notebooks was empty', () => {
		const oldNotebooks = [];
		const notebookListUpdater = new NotebookListUpdater(oldNotebooks);

		const newNotebooks = [{
			parent: undefined,
			id: 'id2',
			name: 'Notebook 2',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		}];
		notebookListUpdater.updateNotebookList(newNotebooks);

		expect(notebookListUpdater.get()).toEqual(newNotebooks);
	});

	it('should return the new notebooks in the getter as an empty list if the update was called with an empty list', () => {
		const oldNotebooks = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		}];
		const notebookListUpdater = new NotebookListUpdater(oldNotebooks);

		const newNotebooks = [];
		notebookListUpdater.updateNotebookList(newNotebooks);

		expect(notebookListUpdater.get()).toEqual(newNotebooks);
	});

	it('should preserve the notebooks if the new notebooks is the same as the old', () => {
		const notebooks = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		}];
		const notebookListUpdater = new NotebookListUpdater(notebooks);

		notebookListUpdater.updateNotebookList(notebooks);

		expect(notebookListUpdater.get()).toEqual(notebooks);
	});

	it('should preserve the old expanded property if a new notebook matches an old one', () => {
		const oldNotebooks = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		}];
		const notebookListUpdater = new NotebookListUpdater(oldNotebooks);

		const newNotebooks = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		}];
		notebookListUpdater.updateNotebookList(newNotebooks);

		expect(notebookListUpdater.get()).toEqual(oldNotebooks);
	});

	it('should not preserve the old hierarchy if a new notebook matches an old one', () => {
		const oldNotebooks: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
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

		const notebookListUpdater = new NotebookListUpdater(oldNotebooks);

		const newNotebooks = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		}];
		notebookListUpdater.updateNotebookList(newNotebooks);

		expect(notebookListUpdater.get()).toEqual(newNotebooks);
	});

	it('should not preserve the old hierarchy if a new notebook matches an old one and the new hierarchy is non-empty', () => {
		const oldNotebooks: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
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

		const notebookListUpdater = new NotebookListUpdater(oldNotebooks);

		const newNotebooks: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
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
		const oldNotebooks: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		}];

		oldNotebooks[0].sections.push({
			parent: oldNotebooks[0],
			id: 's2',
			name: 'Section 2',
			expanded: true,
			pages: [],
			apiUrl: '',
		});

		const oldSectionGroup: SectionGroup = {
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

		const notebookListUpdater = new NotebookListUpdater(oldNotebooks);

		const newNotebooks: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		}];

		newNotebooks[0].sections.push({
			parent: newNotebooks[0],
			id: 's2',
			name: 'Section 2',
			expanded: false,
			pages: [],
			apiUrl: '',
		});

		const newSectionGroup: SectionGroup = {
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
		const oldHierarchy: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		}];

		oldHierarchy[0].sections.push({
			parent: oldHierarchy[0],
			id: 's1',
			name: 'Section 1',
			expanded: true,
			pages: undefined,
			apiUrl: '',
		});

		const notebookListUpdater = new NotebookListUpdater(oldHierarchy);

		const pages = [{
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

		const expectedHierarchy: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
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
		const oldHierarchy: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		}];

		oldHierarchy[0].sections.push({
			parent: oldHierarchy[0],
			id: 's1',
			name: 'Section 1',
			expanded: true,
			pages: undefined,
			apiUrl: '',
		});

		const notebookListUpdater = new NotebookListUpdater(oldHierarchy);

		const pages = [];
		notebookListUpdater.updatePages('s1', pages);

		const expectedHierarchy: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
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
		const oldHierarchy: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		}];

		const oldSectionGroup: SectionGroup = {
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

		const notebookListUpdater = new NotebookListUpdater(oldHierarchy);

		const pages = [];
		notebookListUpdater.updatePages('s1', pages);

		const expectedHierarchy: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		}];

		const newSectionGroup: SectionGroup = {
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
		const oldHierarchy: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			webUrl: '',
			apiUrl: '',
			lastModifiedTime: new Date(),
		}, {
			parent: undefined,
			id: 'id2',
			name: 'Notebook 2',
			expanded: true,
			sectionGroups: [],
			sections: [],
			webUrl: '',
			apiUrl: '',
			lastModifiedTime: new Date(),
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

		const notebookListUpdater = new NotebookListUpdater(oldHierarchy);

		const pages = [{
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

		const expectedHierarchy: Notebook[] = [{
			parent: undefined,
			id: 'id1',
			name: 'Notebook 1',
			expanded: true,
			sectionGroups: [],
			sections: [],
			webUrl: '',
			apiUrl: '',
			lastModifiedTime: new Date(),
		}, {
			parent: undefined,
			id: 'id2',
			name: 'Notebook 2',
			expanded: true,
			sectionGroups: [],
			sections: [],
			webUrl: '',
			apiUrl: '',
			lastModifiedTime: new Date(),
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
