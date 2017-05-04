import * as React from 'react';
import * as ReactDOM from 'react-dom';

import OneNotePicker from '../src/oneNotePicker';
import GlobalProps from "../src/props/globalProps";
import OneNoteDataProvider from "../src/providers/oneNoteDataProvider";
import SampleOneNoteDataProvider from "./sampleOneNoteDataProvider";

let oneNoteDataProvider: OneNoteDataProvider = new SampleOneNoteDataProvider();

oneNoteDataProvider.getNotebooks().then((value) => {
	let globalProps: GlobalProps = {
		globals: {
			oneNoteDataProvider: oneNoteDataProvider
		}
	};
	ReactDOM.render(
		<OneNotePicker globals={globalProps.globals} notebooks={value}/>,
		document.getElementById('oneNotePicker') as HTMLElement
	);
}).catch((value) => {
	console.error(value);
});


