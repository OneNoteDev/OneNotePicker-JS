import * as React from 'react';

import { NodeRenderStrategy } from '../treeView/nodeRenderStrategy';
import { ErrorInfoIconSvg } from '../icons/errorInfoIcon.svg';
import { Strings } from '../../strings';
import { NameValidator } from '../../nameValidator';
import { CreateNewNotebookCommonProperties } from './createNewNotebookCommonProperties';
import { CreateNewNotebookRowTemplate } from './createNewNotebookRowTemplate';

export class CreateNewNotebookInputRenderStrategy extends CreateNewNotebookCommonProperties implements NodeRenderStrategy {
	onClickBinded = () => { };

	constructor(
		private notebookNameInputValue: string,
		private onEnterBinded: (event) => void,
		private onChangeBinded: (event: React.ChangeEvent<HTMLInputElement>) => void,
		private inputRefBinded: (node: HTMLInputElement) => void) {
		super();
	}

	element(): JSX.Element {
		// TODO (machiam) error info should have a popover as per redlines
		return (
			<CreateNewNotebookRowTemplate>
				<div className='picker-label'>
					<input
						className='create-input'
						ref={this.inputRefBinded}
						type='text'
						name='notebookName'
						placeholder={Strings.get('Input.CreateNotebookPlaceholder')}
						autoComplete='off'
						value={this.notebookNameInputValue}
						onKeyPress={this.onKeyPress.bind(this)}
						onChange={this.onChangeBinded} />
				</div>
				<div className='error-info-icon' style={this.showError() ? { } : { visibility: 'hidden' }}>
					<ErrorInfoIconSvg />
				</div>
			</CreateNewNotebookRowTemplate>
		);
	}

	private showError(): boolean {
		return !!NameValidator.validateNotebookName(this.notebookNameInputValue);
	}

	private onKeyPress(event): void {
		if (event.key === 'Enter') {
			this.onEnterBinded(event);
		}
	}
}
