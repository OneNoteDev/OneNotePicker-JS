import {InnerGlobals} from '../../props/globalProps';

export interface CommonNodeProps {
	// This id lets us scope keyboard navigation to elements with the same id
	treeViewId: string;
	id: string;
	level?: number;

	// For VoiceOver accessibility, there must always be one aria-selected item.
	// If there's no actual selected item, this should be the first item.
	ariaSelected: boolean;

	// Typically, the first TreeView element should be tabbable to allow users to
	// navigate into the TreeView control itself
	tabbable?: boolean;
	focusOnMount?: boolean;

	globals: InnerGlobals;
}
