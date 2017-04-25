<template>
	<div class="columns">
		<div class="column">
			<onenote-panel :collection="notebooks"/>
		</div>
		<div class="column">
			<onenote-panel :collection="selectedNotebook" />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import OneNotePanel from "./components/oneNotePanel.vue";

@Component({
	name: "onenote-picker",
	components: { "onenote-panel": OneNotePanel },
	props: {
		notebooks: { required: true }
	}
})

export default class OneNotePicker extends Vue {
	notebooks: OneNoteApi.Notebook[];

	get selectedNotebook() {
		return this.notebooks[0].sections;
	}
}
</script>
