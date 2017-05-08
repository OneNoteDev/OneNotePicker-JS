import {render} from 'enzyme';
import * as React from 'react';

import OneNotePicker from '../src/oneNotePicker';

describe('OneNotePickerComponent', () => {
	it('should compile', () => {
		expect(true).toBe(true);
		let notebooks = [];
		let app = render(<OneNotePicker notebooks={notebooks} />);
		expect(app.find('.menu-list').length).toBe(1);
	});
});
