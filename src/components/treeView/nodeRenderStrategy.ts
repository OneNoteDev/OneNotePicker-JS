/**
 * Defines the design and interactability of a TreeView node that
 * does not have children (i.e., a leaf node).
 */
export interface NodeRenderStrategy {
	onClickBinded: () => void;
	onExpandBinded?: () => void;
	element(): JSX.Element;
	getId(): string;
	getName(): string;
	isSelected(): boolean;
}
