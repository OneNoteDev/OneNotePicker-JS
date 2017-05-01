import OneNotePicker from "./oneNotePicker.vue";
import NotebookItem from "./components/notebookItem.vue";
import SectionGroupItem from "./components/sectionGroupItem.vue";
import SectionItem from "./components/sectionItem.vue";
import { PickerState } from "./state/pickerState";
import { OneNotePickerDataSource}  from "../sampleApp/oneNotePickerDataSource";

window["OneNotePicker"] = OneNotePicker;
window["OneNotePickerDataSource"] = OneNotePickerDataSource;

window["OneNotePickerPlugin"] = {
	install(Vue, store, options, moduleName = 'pickerState') {
		store.registerModule(moduleName, new PickerState);
		Vue.component('notebook-item', NotebookItem);
		Vue.component('section-item', SectionItem);
		Vue.component('section-group-item', SectionGroupItem);
		Vue.component('onenote-picker', OneNotePicker);

		// check if the plugin was correctly initialized
		if (store.state.hasOwnProperty(moduleName) === false) {
			console.error('i18n vuex module is not correctly initialized. Please check the module name:', moduleName);
			return;
		};
	}
};
