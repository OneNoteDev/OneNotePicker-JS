import * as React from 'react';

import { InnerGlobals } from '../../props/globalProps';
import { ExpandableNode } from '../treeView/expandableNode';
import { RecentSectionHeaderRenderStrategy } from './recentSectionHeaderRenderStrategy';
import { Section } from '../../oneNoteDataStructures/section';

export interface RecentSectionsNodeProps extends InnerGlobals {
	sections: Section[];
	level: number;
	tabbable: boolean;
	treeViewId: string;
}

/**
 * Presentation component that extends the 'Create' UX with notebook-specific
 * UI.
 */
export class RecentSectionsNode extends React.Component<RecentSectionsNodeProps, {}> {
	constructor(props: RecentSectionsNodeProps) {
		super(props);
	}

	render() {
		let headerRenderStrategy = new RecentSectionHeaderRenderStrategy(this.props);

		return (
			<ExpandableNode
				globals={this.props} expanded={headerRenderStrategy.isExpanded()} node={headerRenderStrategy}
				treeViewId={this.props.treeViewId} key={headerRenderStrategy.getId()}
				id={headerRenderStrategy.getId()} tabbable={this.props.tabbable} focusOnMount={this.props.focusOnMount}
				ariaSelected={headerRenderStrategy.isAriaSelected()}>
			</ExpandableNode>
		);
	}
}
