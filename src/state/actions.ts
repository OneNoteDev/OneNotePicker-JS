import { Store, ActionTree, ActionContext } from "vuex";
import { State } from "./state";

export function selectNotebook(store: ActionContext<State, any>, key: string) {
	store.commit("SELECT_NOTEBOOK", key);
}

export function selectSection(store: ActionContext<State, any>, key: string) {
	store.commit("SELECT_SECTION", key);
}

export function selectPage(store: ActionContext<State, any>, key: string) {
	store.commit("SELECT_PAGE", key);
}

// export everything compliant to the vuex specification for actions
export default <ActionTree<State, any>> {
	selectNotebook, selectSection, selectPage
};
