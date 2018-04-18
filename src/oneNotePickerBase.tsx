import * as React from 'react';

import './oneNotePicker.scss';

import { Constants } from './constants';
import { Strings } from './strings';
import { GlobalProps } from './props/globalProps';

export abstract class OneNotePickerBase<TState extends GlobalProps, TProps> extends React.Component<TState, TProps> {
	protected get treeViewId() {
		return Constants.TreeView.id;
	}

	protected get activeDescendentId() {
		if (!this.props.globals.ariaSelectedId) {
			return '';
		}
		return this.treeViewId + this.props.globals.ariaSelectedId;
	}

	protected abstract get rootNodes(): JSX.Element[];

	render() {
		return (
			<div className='onenote-picker ms-fontColor-themePrimary'>
				<ul role='tree' aria-label={Strings.get('Accessibility.PickerTableName', this.props.globals.strings)}
					className='menu-list picker-list-header' aria-activedescendent={this.activeDescendentId}>
					{this.rootNodes}
				</ul>
			</div>
		);
	}
}
