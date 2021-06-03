import { Notebook } from '../../src/oneNoteDataStructures/notebook';
import { OneNoteItem } from '../../src/oneNoteDataStructures/oneNoteItem';
import { SectionGroup } from '../../src/oneNoteDataStructures/sectionGroup';
import { OneNoteItemUtils } from '../../src/oneNoteDataStructures/oneNoteItemUtils';
import { Section } from '../../src/oneNoteDataStructures/section';

describe('OneNoteItemUtils', () => {

	it('find should return the item that matches the predicate if it is found early in the hierarchy', () => {
		const notebook: Notebook = {
			parent: undefined,
			id: 'parent',
			name: 'Parent',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		};

		const section: Section = {
			parent: notebook,
			id: 'child',
			name: 'Child',
			expanded: false,
			pages: undefined,
			apiUrl: '',
		};
		notebook.sections.push(section);

		const found = OneNoteItemUtils.find([notebook], item => item.id === 'parent');
		expect(found).toEqual(notebook);
	});

	it('find should return the item that matches the predicate if it is found deep in the hierarchy', () => {
		const notebook: Notebook = {
			parent: undefined,
			id: 'parent',
			name: 'Parent',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		};

		const section: Section = {
			parent: notebook,
			id: 'child',
			name: 'Child',
			expanded: false,
			pages: undefined,
			apiUrl: '',
		};
		notebook.sections.push(section);

		const found = OneNoteItemUtils.find([notebook], item => item.id === 'child');
		expect(found).toEqual(section);
	});

	it('find should return undefined if no item in the hierarchy satisfies the predicate', () => {
		const notebook: Notebook = {
			parent: undefined,
			id: 'parent',
			name: 'Parent',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		};

		const section: Section = {
			parent: notebook,
			id: 'child',
			name: 'Child',
			expanded: false,
			pages: undefined,
			apiUrl: '',
		};
		notebook.sections.push(section);

		const found = OneNoteItemUtils.find([notebook], item => item.id === 'notexist');
		expect(found).toEqual(undefined);
	});

	it('find should return undefined if the hierarchy has no items', () => {
		const found = OneNoteItemUtils.find([], item => true);
		expect(found).toEqual(undefined);
	});

	it('expandTo should expand all ancestors of the item, excluding the item, if the item can be found in the hierarchy', () => {
		const notebook: Notebook = {
			parent: undefined,
			id: 'parent',
			name: 'Parent',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		};

		const section: Section = {
			parent: notebook,
			id: 'child',
			name: 'Child',
			expanded: false,
			pages: undefined,
			apiUrl: '',
		};
		notebook.sections.push(section);

		OneNoteItemUtils.expandTo([notebook], item => item.id === 'child');
		expect(notebook.expanded).toBeTruthy();
		expect(section.expanded).toBeFalsy();
	});

	it('expandTo should not modify the expanded property of the found item even if it is already expanded', () => {
		const notebook: Notebook = {
			parent: undefined,
			id: 'parent',
			name: 'Parent',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		};

		const section: Section = {
			parent: notebook,
			id: 'child',
			name: 'Child',
			expanded: true,
			pages: undefined,
			apiUrl: '',
		};
		notebook.sections.push(section);

		OneNoteItemUtils.expandTo([notebook], item => item.id === 'child');
		expect(section.expanded).toBeTruthy();
	});

	it('expandTo should not do anything if no item in the hierarchy satisfies the predicate', () => {
		const notebook: Notebook = {
			parent: undefined,
			id: 'parent',
			name: 'Parent',
			expanded: false,
			sectionGroups: [],
			sections: [],
			apiUrl: '',
			webUrl: '',
			lastModifiedTime: new Date(),
		};

		const section: Section = {
			parent: notebook,
			id: 'child',
			name: 'Child',
			expanded: false,
			pages: undefined,
			apiUrl: '',
		};
		notebook.sections.push(section);

		OneNoteItemUtils.expandTo([notebook], item => item.id === 'notexist');
		expect(notebook.expanded).toBeFalsy();
		expect(section.expanded).toBeFalsy();
	});

	it('getAncestry should return a list of itself if the parent is undefined', () => {
		const item: OneNoteItem = {
			parent: undefined,
			id: 'id',
			name: 'Item 1',
		};

		const ancestry = OneNoteItemUtils.getAncestry(item);
		expect(ancestry).toEqual([item]);
	});

	it('getAncestry should return a list of itself and its parent in a top-down order if there is only one ancestor in the ancestry', () => {
		const parent: OneNoteItem = {
			parent: undefined,
			id: 'parent',
			name: 'Parent',
		};

		const item: OneNoteItem = {
			parent: parent,
			id: 'child',
			name: 'Child',
		};

		const ancestry = OneNoteItemUtils.getAncestry(item);
		expect(ancestry).toEqual([parent, item]);
	});

	it('getAncestry should return the ancestry starting from the parent if there is more than one ancestor', () => {
		const grandparent: OneNoteItem = {
			parent: undefined,
			id: 'grandparent',
			name: 'Grandparent',
		};

		const parent: OneNoteItem = {
			parent: grandparent,
			id: 'parent',
			name: 'Parent',
		};

		const item: OneNoteItem = {
			parent: parent,
			id: 'child',
			name: 'Child',
		};

		const ancestry = OneNoteItemUtils.getAncestry(item);
		expect(ancestry).toEqual([grandparent, parent, item]);
	});
});
