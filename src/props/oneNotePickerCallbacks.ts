import Notebook from '../oneNoteDataStructures/notebook';
import Section from '../oneNoteDataStructures/section';
import Page from '../oneNoteDataStructures/page';

/**
 * Represents a set of callbacks that the application can register to be
 * notified whenever an 'interesting' synchronous or asynchronous user action
 * happens. The rendering application can choose to act on this new information
 * (e.g., a re-render of the OneNotePicker, logging).
 */
interface OneNotePickerCallbacks {
	onNotebookHierarchyUpdated: (notebooks: Notebook[]) => void;
	onSectionSelected: (section: Section) => void;
	onPageSelected: (page: Page) => void;
}

export default OneNotePickerCallbacks;
