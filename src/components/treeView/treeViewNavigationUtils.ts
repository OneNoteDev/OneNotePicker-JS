/**
 * Provides utility methods for navigating TreeViews.
 */
export class TreeViewNavigationUtils {
	/**
	 * Normalizes the keyboard event by preventing propogation and disabling
	 * the scrolling effect on non-tab key presses.
	 */
	static normalizeKeyboardEventBehaviour(event: KeyboardEvent) {
		event.stopPropagation();
		if (event.keyCode !== 9) {
			// Allow tabbing out
			event.preventDefault();
		}
	}

	/**
	 * In a TreeView, handles up, down, home, and end key presses to behave according
	 * to the wai-aria spec defined in https://www.w3.org/TR/wai-aria-practices-1.1/#TreeView
	 */
	static handleMovementKeyboardEvent(thisId: string, treeViewId: string, event: KeyboardEvent) {
		let navigatables: NodeListOf<HTMLElement>;
		switch (event.keyCode) {
			case 35:
				// End
				navigatables = TreeViewNavigationUtils.getAllNavigatables(treeViewId);
				if (navigatables.length > 0) {
					navigatables[navigatables.length - 1].focus();
				}
				break;
			case 36:
				// Home
				navigatables = TreeViewNavigationUtils.getAllNavigatables(treeViewId);
				if (navigatables.length > 0) {
					navigatables[0].focus();
				}
				break;
			case 38:
				// Up arrow
				let prev = TreeViewNavigationUtils.getNavigatableWithOffset(thisId, treeViewId, -1);
				if (!!prev) {
					prev.focus();
				}
				break;
			case 40:
				// Down arrow
				let next = TreeViewNavigationUtils.getNavigatableWithOffset(thisId, treeViewId, 1);
				if (!!next) {
					next.focus();
				}
				break;
			default:
				break;
		}
	}

	/**
	 * Given a non-zero integer offset, finds the navigatable within the same TreeView that is offsetted from the
	 * element with the id attribute matching thisId.
	 */
	static getNavigatableWithOffset(thisId: string, treeViewId: string, offset: number): HTMLElement | undefined {
		if (offset === 0 || Math.floor(offset) !== 0) {
			// We expect a non-zero integer offset
			return undefined;
		}

		let navigatables = TreeViewNavigationUtils.getAllNavigatables(treeViewId);

		// Depending on the offset, we don't have to check all elements. For example, if we're going
		// backwards by n, we don't need to check the first n elements etc.
		let startIndex = offset < 0 ? 0 - offset : 0;
		let endIndex = offset > 0 ? navigatables.length - offset : navigatables.length;
		for (let i = startIndex; i < endIndex; i++) {
			let currentElem = navigatables[i];
			if (currentElem.getAttribute('data-id') === thisId) {
				return navigatables[i + offset];
			}
		}

		return undefined;
	}

	/**
	 * Given a TreeView id, gets all navigatable (focusable) elements in that TreeView.
	 */
	static getAllNavigatables(treeViewId: string): NodeListOf<HTMLElement> {
		return document.querySelectorAll(`[data-treeviewid=${treeViewId}]`) as NodeListOf<HTMLElement>;
	}
}
