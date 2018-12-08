import * as React from 'react';

import { CommonNodeProps } from './commonNodeProps';
import { ExpandableNodeRenderStrategy } from './expandableNodeRenderStrategy';
import { TreeViewNavigationUtils } from './treeViewNavigationUtils';

export interface ExpandableNodeProps extends CommonNodeProps {
	expanded: boolean;
	node: ExpandableNodeRenderStrategy;
	onExpand?: (expanded: boolean) => void;
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
		this.state = {expanded: props.expanded};
	}

	onClick() {
		const {node} = this.props;
		const nextExpandState = !this.state.expanded;

		this.updateExpandedState(nextExpandState);

 		if (nextExpandState && node.onExpandBinded) {
			node.onExpandBinded();
		}
		node.onClickBinded();

		this.props.globals.callbacks.onAccessibleSelection(node.getId());
	}

	onKeyDown(event: KeyboardEvent) {
		TreeViewNavigationUtils.normalizeKeyboardEventBehaviour(event);

		TreeViewNavigationUtils.handleMovementKeyboardEvent(this.props.id, this.props.treeViewId, event, this.props.globals.callbacks.onAccessibleSelection);

		switch (event.keyCode) {
			case 32:
				// Space
				this.onClick();

				if (this.props.node.selectNode) {
					this.props.node.selectNode()
				}
				break;
			case 37:
				// Left arrow
				if (this.props.node.onCollapseBinded) {
					this.props.node.onCollapseBinded();
				}

				this.updateExpandedState(false);

				if (this.props.node.expandNode) {
					this.props.node.expandNode(false)
				}
				break;
			case 39:
				// Right arrow
				if (this.props.node.onExpandBinded) {
					this.props.node.onExpandBinded();
				}
				this.updateExpandedState(true);
				
				if (this.props.node.expandNode) {
					this.props.node.expandNode(true)
				}
				break;
			default:
				break;
		}
	}

	componentDidMount() {
		const {focusOnMount, id} = this.props;
		if (focusOnMount) {
			const self = document.querySelector(`[data-id='${id}']`) as HTMLElement;
			self.focus();
		}
	}

	private updateExpandedState(expanded: boolean) {
		this.setState({expanded});

		if (this.props.onExpand) {
			this.props.onExpand(expanded);
		}
	}

	private level() {
		return this.props.level || 1;
	}

	private descendentId() {
		return this.props.treeViewId + this.props.id;
	}

	render() {
		return (
			<li>
				<a id={this.descendentId()} className='picker-row' onClick={this.onClick.bind(this)} onKeyDown={this.onKeyDown.bind(this)}
				   data-treeviewid={this.props.treeViewId} data-id={this.props.id}
				   tabIndex={this.props.ariaSelected ? 0 : -1} role='treeitem' aria-labelledby={this.descendentId()} 
				   aria-expanded={this.props.node.isExpanded()} aria-selected={this.props.ariaSelected}
				   aria-level={this.level()} aria-setsize={this.props.setsize} aria-posinset={this.props.posinset}>
					{this.props.children || this.props.node.element()}
				</a>
				{this.props.node.isExpanded() ?
					<ul role='group'>
						{this.props.node.getChildren(this.level() + 1)}
					</ul> : undefined}
			</li>);
	}
}
