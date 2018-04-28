import { Notebook } from '../../src/oneNoteDataStructures/notebook';
import { OneNoteItem } from '../../src/oneNoteDataStructures/oneNoteItem';
import { SectionGroup } from '../../src/oneNoteDataStructures/sectionGroup';
import { OneNoteItemUtils } from '../../src/oneNoteDataStructures/oneNoteItemUtils';
import { Section } from '../../src/oneNoteDataStructures/section';

describe('OneNoteItemUtils', () => {
	const notebook1: Notebook = {
		parent: undefined,
		id: 'notebook',
		name: 'Notebook',
		expanded: false,
		sectionGroups: [],
		sections: [],
		apiUrl: '',
		webUrl: '',
	};

	const notebook2: Notebook = {
		parent: undefined,
		id: 'notebook',
		name: 'Notebook',
		expanded: false,
		sectionGroups: [],
		sections: [],
		apiUrl: '',
		webUrl: '',
	};

	const section1: Section = {
		parent: undefined,
		id: 'child',
		name: 'Child',
		expanded: false,
		pages: undefined,
		apiUrl: '',
	};

	const section2: Section = {
		parent: undefined,
		id: 'child',
		name: 'Child',
		expanded: false,
		pages: undefined,
		apiUrl: '',
	};

	const sectionGroup: SectionGroup = {
		parent: notebook2,
		id: 'child',
		name: 'Child',
		expanded: false,
		sectionGroups: [],
		sections: [],
		apiUrl: ''
	};

	const sectionGroupWithTwoSections: SectionGroup = {
		parent: notebook2,
		id: 'child',
		name: 'Child',
		expanded: false,
		sectionGroups: [],
		sections: [],
		apiUrl: ''
	};
	sectionGroupWithTwoSections.sections.push(section1, section2);		

	const stackedSectionGroup: SectionGroup = {
		parent: notebook2,
		id: 'child',
		name: 'Child',
		expanded: false,
		sectionGroups: [],
		sections: [],
		apiUrl: ''
	};
	stackedSectionGroup.sectionGroups.push(sectionGroup);

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

	it('getDepthOfNotebooks should return a max depth of 1 if there is one notebook with no other children', () => {
		const depthOfNotebooks = OneNoteItemUtils.getDepthOfNotebooks([notebook1]);
		expect(depthOfNotebooks).toEqual(1);
	});

	it('getDepthOfNotebooks should return a max depth of 1 if there are two notebooks with no other children', () => {
		const depthOfNotebooks = OneNoteItemUtils.getDepthOfNotebooks([notebook1, notebook2]);
		expect(depthOfNotebooks).toEqual(1);
	});

	it('getDepthOfNotebooks returns a max depth of 2 when there are two notebooks where one has sections', () => {
		section1.parent = notebook1;
		notebook1.sections.push(section1); 
		
		const depthOfNotebooks = OneNoteItemUtils.getDepthOfNotebooks([notebook1, notebook2]);
		expect(depthOfNotebooks).toEqual(2);
	});

	it('getDepthOfNotebook should return a max depth of 2 when there are two notebooks where one has an empty section group', () => {
		notebook1.sectionGroups.push(sectionGroup);

		const depthOfNotebooks = OneNoteItemUtils.getDepthOfNotebooks([notebook1, notebook2]);
		expect(depthOfNotebooks).toEqual(2);
	});

	it('getDepthOfNotebooks returns a max depth of 3 when there are two notebooks where one has a section group with a section', () => {
		sectionGroup.sections.push(section1);
		notebook1.sectionGroups.push(sectionGroup);

		const depthOfNotebooks = OneNoteItemUtils.getDepthOfNotebooks([notebook1, notebook2]);
		expect(depthOfNotebooks).toEqual(3);
	});

	it('getDepthOfNotebooks returns a max depth of three when there are two notebooks where one has a section group with multiple sections', () => {
		notebook1.sectionGroups.push(sectionGroupWithTwoSections);

		const depthOfNotebooks = OneNoteItemUtils.getDepthOfNotebooks([notebook1, notebook2]);
		expect(depthOfNotebooks).toEqual(3);
	});

	it('getDepthOfNotebooks returns the correct depth when there are two notebooks with a more complicated tree structure', () => {
		notebook1.sectionGroups.push(sectionGroupWithTwoSections);
		notebook2.sectionGroups.push(stackedSectionGroup);

		const depthOfNotebooks = OneNoteItemUtils.getDepthOfNotebooks([notebook1, notebook2]);
		expect(depthOfNotebooks).toEqual(3);
	});

	it('getDepthOfNotebooks returns a max depth of 0 if it is given an empty array of Notebooks', () => {
		expect(OneNoteItemUtils.getDepthOfNotebooks([])).toEqual(0);
	});

});
