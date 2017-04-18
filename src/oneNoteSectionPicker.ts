import Vue from "vue";
import Component from "vue-class-component";

@Component({
	props: ["notebooks"],
	template: `
		<div>
			<p v-for="notebook in notebooks">{{ notebook.name }}</p>
		</div>
	`
})

export default class OneNoteSectionPicker extends Vue {
}
