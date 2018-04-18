import { GlobalProps } from '../src/props/globalProps';
import { MockProps } from './props/mockProps';

import { render } from 'enzyme';
import * as React from 'react';

import { OneNotePicker } from '../src/oneNotePicker';

describe('OneNotePicker', () => {
	it('should compile', () => {
		const notebooks = [];
		const globalProps: GlobalProps = MockProps.getGlobalProps(notebooks);

		const app = render(<OneNotePicker globals={globalProps.globals} notebooks={notebooks} />);
		expect(app.find('.menu-list').length).toBe(1);
	});
});
