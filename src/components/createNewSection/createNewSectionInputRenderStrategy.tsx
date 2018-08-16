import * as React from 'react';

import { NodeRenderStrategy } from '../treeView/nodeRenderStrategy';
import { Strings } from '../../strings';
import { NameValidator } from '../../nameValidator';
import { CreateNewSectionCommonProperties } from './createNewSectionCommonProperties';
import { CreateNewSectionRowTemplate } from './createNewSectionRowTemplate';
import { ErrorIconWithPopover } from '../errorIconWithPopover';
import { CreateNewSectionNodeProps } from './createNewSectionNode';

export class CreateNewSectionInputRenderStrategy extends CreateNewSectionCommonProperties implements NodeRenderStrategy {
	onClickBinded = this.onClick.bind(this);

	constructor(
		parentId: string,
		private notebookNameInputValue: string,
		private props: CreateNewSectionNodeProps,
		private onEnterBinded: (event) => void,
		private onChangeBinded: (event: React.ChangeEvent<HTMLInputElement>) => void,
		private inputRefBinded: (node: HTMLInputElement) => void,
		private setInputToNotStarted: () => void) {
		super(parentId);
	}

	element(): JSX.Element {
		return (
			<CreateNewSectionRowTemplate>
				<div className='picker-label'>
					<input
						className='create-input'
						ref={this.inputRefBinded}
						type='text'
						placeholder={Strings.get('Input.CreateSectionPlaceholder')}
						autoComplete='off'
						value={this.notebookNameInputValue}
						onKeyPress={this.onKeyPress.bind(this)}
						onChange={this.onInputChange.bind(this)} />
				</div>
				<i className='picker-input-x ms-Icon ms-Icon--Clear' onClick={this.setInputToNotStarted}></i>
				<ErrorIconWithPopover errorMessage={this.errorIfExists()}></ErrorIconWithPopover>
			</CreateNewSectionRowTemplate>
		);
	}

	private errorIfExists(): string | undefined {
		return NameValidator.validateSectionName(this.notebookNameInputValue);
	}

	private onKeyPress(event): void {
		if (event.key === 'Enter') {
			this.onEnterBinded(event);
		}
	}

	private onInputChange(event): void {
		const sectionName = (event.target as HTMLInputElement).value;
		const onSectionInputValueChanged = this.props.callbacks.onSectionInputValueChanged;
		if (!!onSectionInputValueChanged) {
			onSectionInputValueChanged(sectionName);
		}
		const onSectionInputSelected = this.props.callbacks.onSectionInputSelected;
		if (!!onSectionInputSelected) {
			onSectionInputSelected(this.props.parent, this.props.parentIsNotebook, sectionName);
		}
		this.onChangeBinded(event);
	}

	private onClick(): void {
		const onSectionInputSelected = this.props.callbacks.onSectionInputSelected;
		if (!!onSectionInputSelected) {
			onSectionInputSelected(this.props.parent, this.props.parentIsNotebook, this.notebookNameInputValue);
		}
	}
}
