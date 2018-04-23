import * as React from 'react';

import { NodeRenderStrategy } from '../treeView/nodeRenderStrategy';
import { ErrorInfoIconSvg } from '../icons/errorInfoIcon.svg';
import { Strings } from '../../strings';
import { CreateNewNotebookCommonProperties } from './createNewNotebookCommonProperties';
import { CreateNewNotebookRowTemplate } from './createNewNotebookRowTemplate';

export class CreateNewNotebookCreateErrorRenderStrategy extends CreateNewNotebookCommonProperties implements NodeRenderStrategy {
	onClickBinded = () => { };

	// We don't listen for enter as we assume that we want the user to change the name before
	// re-attempting the create
	constructor(
		private notebookNameInputValue: string,
		private onChangeBinded: (event: React.ChangeEvent<HTMLInputElement>) => void) {
		super();
	}

	element(): JSX.Element {
		// TODO (machiam) error info should have a popover as per redlines
		return (
			<CreateNewNotebookRowTemplate>
				<div className='picker-label'>
					<input
						className='create-input'
						type='text'
						placeholder={Strings.get('Input.CreateNotebookPlaceholder')}
						autoComplete='off'
						value={this.notebookNameInputValue}
						onChange={this.onChangeBinded} />
				</div>
				<div className='error-info-icon'>
					<ErrorInfoIconSvg />
				</div>
			</CreateNewNotebookRowTemplate>
		);
	}
}
