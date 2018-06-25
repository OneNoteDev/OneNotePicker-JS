import * as React from 'react';

import { NodeRenderStrategy } from '../treeView/nodeRenderStrategy';
import { Strings } from '../../strings';
import { NameValidator } from '../../nameValidator';
import { CreateNewNotebookCommonProperties } from './createNewNotebookCommonProperties';
import { CreateNewNotebookRowTemplate } from './createNewNotebookRowTemplate';
import { ErrorIconWithPopover } from '../errorIconWithPopover';
import { OneNotePickerCallbacks } from '../../props/oneNotePickerCallbacks';

export class CreateNewNotebookInputRenderStrategy extends CreateNewNotebookCommonProperties implements NodeRenderStrategy {
	onClickBinded = this.onClick.bind(this);

	constructor(
		private notebookNameInputValue: string,
		private onEnterBinded: (event) => void,
		private onChangeBinded: (event: React.ChangeEvent<HTMLInputElement>) => void,
		private inputRefBinded: (node: HTMLInputElement) => void,
		private callbacks: OneNotePickerCallbacks) {
		super();
	}

	element(): JSX.Element {
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
						onChange={this.onInputChange.bind(this)} />
				</div>
				<ErrorIconWithPopover errorMessage={this.errorIfExists()}></ErrorIconWithPopover>
			</CreateNewNotebookRowTemplate>
		);
	}

	private errorIfExists(): string | undefined {
		return NameValidator.validateNotebookName(this.notebookNameInputValue);
	}

	private onKeyPress(event): void {
		if (event.key === 'Enter') {
			this.onEnterBinded(event);
		}
	}

	private onInputChange(event): void {
		const notebookName = (event.target as HTMLInputElement).value;
		const onNotebookInputValueChanged = this.callbacks.onNotebookInputValueChanged;
		if (!!onNotebookInputValueChanged) {
			onNotebookInputValueChanged(notebookName);
		}
		this.onChangeBinded(event);
	}

	private onClick(): void {
		const onNotebookInputSelected = this.callbacks.onNotebookInputSelected;
		if (!!onNotebookInputSelected) {
			onNotebookInputSelected();
		}
	}
}
