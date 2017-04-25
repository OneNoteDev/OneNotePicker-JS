import { Getter, GetterTree } from "vuex";
import { State } from "./state";

export function all (state: State): State {
	return state;
}

// export everything compliant to the vuex specification for getters
export default <GetterTree<State, any>>{
	all
};
