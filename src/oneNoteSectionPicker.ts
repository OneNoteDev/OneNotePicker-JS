import Vue from "vue";
import Component from "vue-class-component";
import MenuItem from "./components/menuItem";

Vue.component("menu-item", MenuItem);

@Component({
	props: ["notebooks"],
	template: `
		<aside class="menu">
			<ul class="menu-list">
				<menu-item v-for="notebook in notebooks" :key="notebook" :itemName="notebook.name"></menu-item>
			</ul>
		</aside>
	`
})

export default class OneNoteSectionPicker extends Vue {
}
