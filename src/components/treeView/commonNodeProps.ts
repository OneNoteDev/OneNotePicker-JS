export interface CommonNodeProps {
	// This id lets us scope keyboard navigation to elements with the same id
	treeViewId: string;
	id: string;

	// Typically, the first TreeView element should be tabbable to allow users to
	// navigate into the TreeView control itself
	tabbable?: boolean;
}
