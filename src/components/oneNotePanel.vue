<template>
	<nav class="panel">
		<onenote-notebook-item v-for="item in collection" :key="item" :name="item.name" :id="item.id">
		</onenote-notebook-item>
	</nav>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import NotebookItem from "./notebookItem.vue";

@Component({
	name: "onenote-panel",
	components: { "onenote-notebook-item": NotebookItem },
	props: {
		collection: { required: true }
	}
})

export default class OneNotePanel extends Vue {
}
</script>

