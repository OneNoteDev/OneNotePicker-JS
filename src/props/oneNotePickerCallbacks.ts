import OneNoteItem from '../oneNoteDataStructures/oneNoteItem';
import Notebook from '../oneNoteDataStructures/notebook';
import Section from '../oneNoteDataStructures/section';
import Page from '../oneNoteDataStructures/page';

/**
 * Represents a set of callbacks that the application can register to be
 * notified whenever an 'interesting' synchronous or asynchronous user action
 * happens. The rendering application can choose to act on this new information
 * (e.g., a re-render of the OneNotePicker, logging). If a selection callback
 * is specified for a particular OneNote item type, the picker will assume that
 * it is selectable. If a selection callback is not specified, the picker will
 * assume the opposite. The picker will only allow items to be expandable until
 * the deepest selectable object. There should be at least one selection callback
 * specified.
 */
interface OneNotePickerCallbacks {
	onNotebookHierarchyUpdated: (notebooks: Notebook[]) => void;

	// Selection callbacks
	onNotebookSelected?: (notebook: Notebook, breadcrumbs: OneNoteItem[]) => void;
	onSectionSelected?: (section: Section, breadcrumbs: OneNoteItem[]) => void;
	onPageSelected?: (page: Page, breadcrumbs: OneNoteItem[]) => void;
}

export default OneNotePickerCallbacks;
