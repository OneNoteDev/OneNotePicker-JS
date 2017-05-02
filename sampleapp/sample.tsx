import * as React from 'react';
import * as ReactDOM from 'react-dom';
import OneNotePicker from '../src/oneNotePicker';

import { SampleDataSource } from "./sampleDataSource";

let dataSource: SampleDataSource = new SampleDataSource();

let data = {
	notebooks: []
};

dataSource.getNotebooks().then((value) => {
	data.notebooks = value;
}).catch((value) => {
	console.error(value);
});

ReactDOM.render(
	<OneNotePicker />,
	document.getElementById('oneNotePicker') as HTMLElement
);

