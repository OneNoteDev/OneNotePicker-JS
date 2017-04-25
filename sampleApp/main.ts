import Vue from "vue";
import OneNotePicker from "../src/oneNotePicker.vue";
import {OneNotePickerDataSource} from "./oneNotePickerDataSource";

let data = {
	notebooks: []
};

let oneNotePicker = new Vue({
	el: "#oneNotePicker",
	data: data,
	render: h => h(OneNotePicker, {
		props: { notebooks: data.notebooks }
	})
});

let dataSource: OneNotePickerDataSource = new OneNotePickerDataSource("amazing");

dataSource.getNotebooks({"MS-Int-AppId": "OneNote Test"}).then((value) => {
	console.log(value);
	data.notebooks = value;
}).catch((value) => {
	console.error(value);
});
