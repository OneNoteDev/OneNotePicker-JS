import * as React from 'react';

import {CommonNodeProps} from './commonNodeProps';
import {ExpandableNodeRenderStrategy} from './expandableNodeRenderStrategy';
import {TreeViewNavigationUtils} from './treeViewNavigationUtils';

export interface ExpandableNodeProps extends CommonNodeProps {
	expanded: boolean;
	node: ExpandableNodeRenderStrategy;
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
		let nextExpandState = !this.state.expanded;

		this.setState({ expanded: nextExpandState });

		if (nextExpandState && this.props.node.onExpandBinded) {
			this.props.node.onExpandBinded();
		}
		this.props.node.onClickBinded();
	}

	onKeyDown(event: KeyboardEvent) {
		TreeViewNavigationUtils.normalizeKeyboardEventBehaviour(event);

		TreeViewNavigationUtils.handleMovementKeyboardEvent(this.props.id, this.props.treeViewId, event);

		switch (event.keyCode) {
			case 32:
				// Space
				this.onClick();
				break;
			case 37:
				// Left arrow
				this.setState({ expanded: false });
				break;
			case 39:
				// Right arrow
				if (this.props.node.onExpandBinded) {
					this.props.node.onExpandBinded();
				}
				this.setState({ expanded: true });
				break;
			default:
				break;
		}
	}

	render() {
		return (
			<li aria-expanded={this.state.expanded} role='treeitem'>
				<a className='picker-row' onClick={this.onClick.bind(this)} onKeyDown={this.onKeyDown.bind(this)}
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
