import * as React from 'react';

import {NodeRenderStrategy} from './nodeRenderStrategy';

export interface LeafNodeProps {
	treeViewId: string;
	node: NodeRenderStrategy;
	id: string;
	tabbable?: boolean;
}

export class LeafNode extends React.Component<LeafNodeProps, {}> {
	onKeyDown(event: KeyboardEvent) {
		event.stopPropagation();

		if (event.keyCode !== 9) {
			// Allow tabbing out
			event.preventDefault();
		}
		
		let navigatables: NodeListOf<HTMLElement>;
		switch (event.keyCode) {
			case 13:
				// Enter
				this.props.node.onClick();
				break;
			case 35:
				// End
				navigatables = this.getAllNavigatables();
				if (navigatables.length > 0) {
					navigatables[navigatables.length - 1].focus();
				}
				break;
			case 36:
				// Home
				navigatables = this.getAllNavigatables();
				if (navigatables.length > 0) {
					navigatables[0].focus();
				}
				break;
			case 37:
				// Left arrow
				this.setState({ expanded: false });
				break;
			case 38:
				// Up arrow
				let prev = this.getNavigatableWithOffset(-1);
				if (!!prev) {
					prev.focus();
				}
				break;
			default:
				break;
		}
	}

	private getNavigatableWithOffset(offset: number): HTMLElement | undefined {
		let navigatables = this.getAllNavigatables();

		// Depending on the offset, we don't have to check all elements. For example, if we're going
		// backwards by n, we don't need to check the first n elements etc.
		let startIndex = offset < 0 ? 0 - offset : 0;
		let endIndex = offset > 0 ? navigatables.length - offset : navigatables.length;
		for (let i = startIndex; i < endIndex; i++) {
			let currentElem = navigatables[i];
			if (currentElem.getAttribute('data-id') === this.props.id) {
				return navigatables[i + offset];
			}
		}

		return undefined;
	}

	private getAllNavigatables(): NodeListOf<HTMLElement> {
		return document.querySelectorAll(`[data-treeviewid=${this.props.treeViewId}]`) as NodeListOf<HTMLElement>;
	}

	render() {
		return (
			<li role='treeitem'>
				<a onClick={this.props.node.onClick.bind(this)} data-treeviewid={this.props.treeViewId}
					data-id={this.props.id} tabIndex={this.props.tabbable ? 0 : -1}>
					{this.props.node.element()}
				</a>
			</li>);
	}
}
