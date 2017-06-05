/**
 * Defines the design and interactability of a TreeView node that
 * does not have children (i.e., a leaf node).
 */
export interface RenderableNode {
	element(): JSX.Element;
	onClick();
}

/**
 * Defines the design and interactability of a TreeView node that
 * has children (i.e., a parent node).
 */
export interface RenderableExpandableNode extends RenderableNode {
	getChildren(): JSX.Element[];
}
