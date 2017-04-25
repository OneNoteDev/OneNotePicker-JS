import Vue from "vue";
import {OneNotePickerDataSource} from "./oneNotePickerDataSource";

let data = {
	notebooks: []
};

let app = new Vue({
	el: "#oneNotePicker",
	data: data
});

let dataSource: OneNotePickerDataSource = new OneNotePickerDataSource("amazing");

dataSource.getNotebooks({"MS-Int-AppId": "OneNote Test"}).then((value) => {
	console.log(value);
	data.notebooks = value;
}).catch((value) => {
	console.error(value);
});
