import { Mutation, MutationTree } from "vuex";
import { State } from "./state";

export function SELECT_NOTEBOOK(state: State, id: string) {
	state.selectedNotebookId = id;
}

// export everything compliant to the vuex specification for getters
export default <MutationTree<State>>{
	SELECT_NOTEBOOK
};

