import Vue from "vue";
import Component from "vue-class-component";

@Component({
	props: {
		name: { required: true },
		selected: { default: false }
	},

	template: `
		<a class="panel-block"
			@click="selectNotebook(name)">
			<span class="panel-icon">
				<i class="fa fa-book"></i>
			</span>
			{{ name }}
		</a>
	`
})

export default class NotebookItem extends Vue {
	selected: Boolean;

	isSelected: Boolean;
	itemName: string;

	selectNotebook(notebookName: string): void {
		this.$emit("selected", notebookName);
	}

	mounted() {
		this.isSelected = this.selected;
	}
}
