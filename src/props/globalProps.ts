import OneNoteDataProvider from '../providers/oneNoteDataProvider';

/**
 * Props accessible by all components in the project. We expose a single
 * property with all globals in it to avoid having to change every components'
 * render method whenever this interface gets modified. This interface should
 * be modified as sparingly as possible.
 */
interface GlobalProps {
	globals: {
		oneNoteDataProvider: OneNoteDataProvider;
	}
}

export default GlobalProps;
