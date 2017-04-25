<template>
	<nav class="panel">
		<onenote-notebook-item v-for="item in collection" :key="item" :name="item.name" v-on:selected="itemSelected">
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
	itemSelected(name) {
		console.log("onenote-panel: Item selected : " + name);
		this.$emit("selected", name);
	}

	mounted() {
		console.log("notebooks: " + this.$children);
	}
}
</script>

