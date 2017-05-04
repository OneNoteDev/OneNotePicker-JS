import * as React from 'react';
import * as ReactDOM from 'react-dom';

import OneNotePicker from '../src/oneNotePicker';
import GlobalProps from "../src/props/globalProps";
import OneNoteApiDataProvider from "../src/providers/oneNoteApiDataProvider";

import SampleDataSource from "./sampleDataSource";

// TODO replace this data source with the new provider
let dataSource: SampleDataSource = new SampleDataSource();

dataSource.getNotebooks().then((value) => {
	let globalProps: GlobalProps = {
		globals: {
			oneNoteDataProvider: new OneNoteApiDataProvider()
		}
	};
	ReactDOM.render(
		<OneNotePicker globals={globalProps.globals} notebooks={value}/>,
		document.getElementById('oneNotePicker') as HTMLElement
	);
}).catch((value) => {
	console.error(value);
});


