interface OneNoteItem {
	// Undefined is there so we can treat every OneNoteItem as the same
	// in our tree-walking, despite notebooks not having parents
	parent: OneNoteItem | undefined;

	id: string;
	name: string;
}

export default OneNoteItem;
