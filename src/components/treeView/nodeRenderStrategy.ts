/**
 * Defines the design and interactability of a TreeView node that
 * does not have children (i.e., a leaf node).
 */
export interface NodeRenderStrategy {
	element(): JSX.Element;
	onClick();
	getId(): string;
}
