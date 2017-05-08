import * as React from 'react';
import * as ReactDOM from 'react-dom';
import OneNotePicker from '../src/oneNotePicker';

import { SampleDataSource } from './sampleDataSource';

let dataSource: SampleDataSource = new SampleDataSource();

dataSource.getNotebooks().then((value) => {
	ReactDOM.render(
		<OneNotePicker notebooks={value}/>,
		document.getElementById('oneNotePicker') as HTMLElement
	);
}).catch((value) => {
	console.error(value);
});


