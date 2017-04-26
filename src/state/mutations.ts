import { Mutation, MutationTree } from "vuex";
import { State } from "./state";

export function SELECT_NOTEBOOK(state: State, id: string) {
	state.selectedNotebookId = id;
}

export function SELECT_SECTION(state: State, id: string) {
	state.selectedSectionId = id;
}

export function SELECT_PAGE(state: State, id: string) {
	state.selectedPageId = id;
}

// export everything compliant to the vuex specification for getters
export default <MutationTree<State>>{
	SELECT_NOTEBOOK, SELECT_SECTION, SELECT_PAGE
};

