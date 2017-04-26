import { Module, GetterTree, MutationTree, ActionTree, Plugin } from "vuex";
import { State } from "./state";
import Mutations from "./mutations";
import Getters from "./getters";
import Actions from "./actions";

export class PickerState implements Module<State, any> {

	// resolve namespacing, applies "foo/bar/..." stuff automatically
	namespaced: true;

	// default properties required for vuex stores/modules
	state: State;
	mutations = Mutations;
	getters = Getters;
	actions = Actions;
	plugins: Plugin<State>[] | undefined = [];

	// create everything
	constructor(plugins?: Plugin<State>[]) {
		this.state = new State();
		this.plugins = plugins;
	}
}
