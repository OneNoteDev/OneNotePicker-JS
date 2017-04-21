import Vue from "vue";
import OneNoteSectionPicker from "../src/oneNotePicker";
import {OneNotePickerDataSource} from "./oneNotePickerDataSource";

Vue.component("onenote-picker", OneNoteSectionPicker);

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
