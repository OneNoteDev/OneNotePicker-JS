import Vue from "vue";
import Component from "vue-class-component";
import MenuItem from "./components/menuItem";

Vue.component("menu-item", MenuItem);

@Component({
	props: ["notebooks"],
	template: `
		<div>
			<menu-item v-for="notebook in notebooks" v-bind:key="notebook" :itemName="notebook.name"></menu-item>
		</div>
	`
})

export default class OneNoteSectionPicker extends Vue {
}
