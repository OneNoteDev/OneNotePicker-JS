import Vue from "vue";
import Vuex from "vuex";
import OneNotePicker from "../src/oneNotePicker.vue";
import { OneNotePickerDataSource } from "./oneNotePickerDataSource";

import { State } from "../src/state/state";
import { PickerState } from "../src/state/pickerState";

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: { pickerState: new PickerState }
});

let data = {
	notebooks: []
};

let oneNotePicker = new Vue({
	el: "#oneNotePicker",
	store,
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
