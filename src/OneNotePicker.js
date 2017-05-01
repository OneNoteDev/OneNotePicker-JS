import Vue from "vue";
import Vuex from "vuex";

import OneNotePicker from "./oneNotePicker.vue";
import { OneNotePickerDataSource}  from "../sampleApp/oneNotePickerDataSource";

window["OneNotePicker"] = OneNotePicker;
window["OneNotePickerDataSource"] = OneNotePickerDataSource;
window["Vue"] = Vue;
window["Vuex"] = Vuex;
