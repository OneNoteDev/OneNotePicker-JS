<template>
	<div class="columns">
		<div class="column">
			<onenote-panel :collection="notebooks" v-on:selected="itemSelected" />
		</div>
		<div class="column">
			<onenote-panel :collection="selectedNotebook" />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
	name: "onenote-picker",
	props: {
		notebooks: { required: true }
	}
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
</script>
