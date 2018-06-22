import * as React from 'react';

import { NodeRenderStrategy } from '../treeView/nodeRenderStrategy';
import { AddIconSvg } from '../icons/addIcon.svg';
import { ChevronSvg } from '../icons/chevron.svg';
import { Strings } from '../../strings';
import { CreateNewNotebookCommonProperties } from './createNewNotebookCommonProperties';
import { OneNotePickerCallbacks } from '../../props/oneNotePickerCallbacks';

export class CreateNewNotebookNotStartedRenderStrategy extends CreateNewNotebookCommonProperties implements NodeRenderStrategy {
	onClickBinded = this.onClickNotebookInput.bind(this);

	constructor(
		private onClick: () => void,
		private callbacks: OneNotePickerCallbacks) {
		super();
	}

	element(): JSX.Element {
		return (
			<div className='notebook'>
				<div className='chevron-icon closed' style={{ visibility: 'hidden' }}>
					<ChevronSvg />
				</div>
				<div className='picker-icon'>
					<AddIconSvg />
				</div>
				<div className='picker-label'>
					<label className='create-label'>{Strings.get('Label.CreateNotebook')}</label>
				</div>
			</div>
		);
	}

	private onClickNotebookInput(): void {
		const onNotebookInputSelected = this.callbacks.onNotebookInputSelected;
		if (!!onNotebookInputSelected) {
			onNotebookInputSelected();
		}
		this.onClick()
	}
}
