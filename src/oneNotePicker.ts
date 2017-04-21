import Vue from "vue";
import Component from "vue-class-component";
import OneNotePanel from "./components/oneNotePanel";

Vue.component("onenote-panel", OneNotePanel);

/**
 * Defines <onenote-picker>
 */
@Component({
	props: {
		notebooks: { required: true }
	},
	template: `
		<div class="columns">
			<div class="column">
				<onenote-panel :collection="notebooks" v-on:selected="itemSelected"/>
			</div>
			<div class="column">
				<onenote-panel :collection="selectedNotebook" />
			</div>
		</div>
	`
})

export default class OneNotePicker extends Vue {
	notebooks: OneNoteApi.Notebook[] = [];

	itemSelected(name) {
		console.log("onenote-picker: ItemSelected: " + name);
	}

	get selectedNotebook() {
		return this.notebooks[0].sections;
	}
}
