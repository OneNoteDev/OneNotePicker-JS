<template>
	<a class="panel-block" @click="selectNotebook(id)">
		<span class="panel-icon">
			<i class="fa fa-book"></i>
		</span> {{ name }}
	</a>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
	name: "notebook-item",
	props: {
		id: { required: true },
		name: { required: true },
		selected: { default: false }
	}
})

export default class NotebookItem extends Vue {
	selected: Boolean;

	isSelected: Boolean;
	itemName: string;

	selectNotebook(sectionId: string): void {
		this.$store.dispatch('selectSection', sectionId);
	}

	mounted() {
		this.isSelected = this.selected;
	}
}
</script>
