import {OneNoteItem} from '../../src/oneNoteDataStructures/oneNoteItem';
import {OneNoteItemUtils} from '../../src/oneNoteDataStructures/oneNoteItemUtils';

describe('OneNoteItemUtils', () => {
	it('should return a list of itself if the parent is undefined', () => {
		let item: OneNoteItem = {
			parent: undefined,
			id: 'id',
			name: 'Item 1',
		};

		let ancestry = OneNoteItemUtils.getAncestry(item);
		expect(ancestry).toEqual([item]);
	});

	it('should return a list of itself and its parent in a top-down order if there is only one ancestor in the ancestry', () => {
		let parent: OneNoteItem = {
			parent: undefined,
			id: 'parent',
			name: 'Parent'
		};

		let item: OneNoteItem = {
			parent: parent,
			id: 'child',
			name: 'Child',
		};

		let ancestry = OneNoteItemUtils.getAncestry(item);
		expect(ancestry).toEqual([parent, item]);
	});

	it('should return the ancestry starting from the parent if there is more than one ancestor', () => {
		let grandparent: OneNoteItem = {
			parent: undefined,
			id: 'grandparent',
			name: 'Grandparent'
		};

		let parent: OneNoteItem = {
			parent: grandparent,
			id: 'parent',
			name: 'Parent'
		};

		let item: OneNoteItem = {
			parent: parent,
			id: 'child',
			name: 'Child',
		};

		let ancestry = OneNoteItemUtils.getAncestry(item);
		expect(ancestry).toEqual([grandparent, parent, item]);
	});
});
