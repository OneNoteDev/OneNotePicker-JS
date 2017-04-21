import Vue from "vue";
import Component from "vue-class-component";
import NotebookItem from "./notebookItem";

Vue.component("onenote-notebook-item", NotebookItem);

/**
 * Defines <onenote-panel>
 */
@Component({
	props: {
		collection: { required: true }
	},
	template: `
		<nav class="panel">
			<onenote-notebook-item v-for="item in collection"
				:key="item"
				:name="item.name"
				v-on:selected="itemSelected">
			</onenote-notebook-item>
		</nav>
	`
})

export default class OneNotePanel extends Vue {
	itemSelected(name) {
		console.log("onenote-panel: Item selected : " + name);
		this.$emit("selected", name);
	}

	mounted() {
		console.log("notebooks: " + this.$children);
	}
}

