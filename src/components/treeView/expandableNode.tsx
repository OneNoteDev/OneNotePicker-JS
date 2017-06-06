import * as React from 'react';

import {ExpandableNodeRenderStrategy} from './expandableNodeRenderStrategy';
import {TreeViewNavigationUtils} from './treeViewNavigationUtils';

export interface ExpandableNodeProps {
	// This id lets us scope keyboard navigation to elements with the same id
	treeViewId: string;
	expanded: boolean;
	node: ExpandableNodeRenderStrategy;
	id: string;
	tabbable?: boolean;
}

export interface ExpandableNodeState {
	expanded: boolean;
}

/**
 * Accessible TreeView parent node that supports keyboard navigation outlined in the
 * spec: https://www.w3.org/TR/wai-aria-practices-1.1/#TreeView
 * The design and interactability is defined by the injected RenderableExpandableNode
 * object, allowing for extensibility.
 */
export class ExpandableNode extends React.Component<ExpandableNodeProps, ExpandableNodeState> {
	constructor(props: ExpandableNodeProps) {
		super(props);
		this.state = { expanded: props.expanded };
	}

	onClick() {
		this.setState({ expanded: !this.state.expanded });
		this.props.node.onClick();
	}

	onKeyDown(event: KeyboardEvent) {
		TreeViewNavigationUtils.normalizeKeyboardEventBehaviour(event);

		TreeViewNavigationUtils.handleMovementKeyboardEvent(this.props.id, this.props.treeViewId, event);

		switch (event.keyCode) {
			case 13:
				// Enter
				this.onClick();
				break;
			case 37:
				// Left arrow
				this.setState({ expanded: false });
				break;
			case 39:
				// Right arrow
				this.setState({ expanded: true });
				break;
			default:
				break;
		}
	}

	render() {
		return (
			<li aria-expanded={this.state.expanded} role='treeitem'>
				<a onClick={this.onClick.bind(this)} onKeyDown={this.onKeyDown.bind(this)}
					data-treeviewid={this.props.treeViewId} data-id={this.props.id} tabIndex={this.props.tabbable ? 0 : -1}>
					{this.props.node.element()}
				</a>
				{this.state.expanded ?
					<ul role='group'>
						{this.props.node.getChildren()}
					</ul> : undefined}
			</li>);
	}
}
