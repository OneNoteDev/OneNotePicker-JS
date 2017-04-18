import Vue from "vue";
import OneNoteSectionPicker from "../src/oneNoteSectionPicker";
import {OneNotePickerDataSource} from "./oneNotePickerDataSource";

Vue.component("onenote-section-picker", OneNoteSectionPicker);

let data = {
	notebooks: []
};

let app = new Vue({
	el: "#app",
	data: data
});

let dataSource: OneNotePickerDataSource = new OneNotePickerDataSource("amazing");

dataSource.getNotebooks({"MS-Int-AppId": "OneNote Test"}).then((value) => {
	console.log(value);
	data.notebooks = value;
}).catch((value) => {
	console.error(value);
});
