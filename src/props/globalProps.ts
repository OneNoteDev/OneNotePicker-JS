import {OneNotePickerCallbacks} from './oneNotePickerCallbacks';
import {OneNoteDataProvider} from '../providers/oneNoteDataProvider';
import {NotebookListUpdater} from '../oneNoteDataStructures/notebookListUpdater';

/**
 * Props accessible by all components in the project. We expose a single
 * property with all globals in it to avoid having to change every components'
 * render method whenever this interface gets modified. This interface should
 * be modified as sparingly as possible and should only consist of things that
 * truly need to be accessed on a global scale.
 */
export interface GlobalProps {
	globals: {
		oneNoteDataProvider: OneNoteDataProvider;
		notebookListUpdater: NotebookListUpdater;
		callbacks: OneNotePickerCallbacks;

		// TODO we need a way to distinguish between section and page
		selectedId?: string;
	};
}
