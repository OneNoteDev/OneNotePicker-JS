import { NodeRenderStrategy } from './nodeRenderStrategy';

/**
 * Defines the design and interactability of a TreeView node that
 * has children (i.e., a parent node).
 */
export interface ExpandableNodeRenderStrategy extends NodeRenderStrategy {
	getChildren(childrenLevel: number): JSX.Element[];
	isExpanded(): boolean;
}
