import GlobalProps from '../src/props/globalProps';
import MockProps from './props/mockProps';

import { render } from 'enzyme';
import * as React from 'react';

import OneNotePicker from '../src/oneNotePicker';

describe('OneNotePickerComponent', () => {
	it('should compile', () => {
		let notebooks = [];
		let globalProps: GlobalProps = MockProps.getGlobalProps(notebooks);

		let app = render(<OneNotePicker globals={globalProps.globals} notebooks={notebooks} />);
		expect(app.find('.menu-list').length).toBe(1);
	});
});
