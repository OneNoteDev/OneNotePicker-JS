import * as React from 'react';

import { NodeRenderStrategy } from '../treeView/nodeRenderStrategy';
import { Strings } from '../../strings';
import { CreateNewSectionCommonProperties } from './createNewSectionCommonProperties';
import { CreateNewSectionRowTemplate } from './createNewSectionRowTemplate';
import { ErrorIconWithPopover } from '../errorIconWithPopover';

export class CreateNewSectionErrorRenderStrategy extends CreateNewSectionCommonProperties implements NodeRenderStrategy {
	onClickBinded = () => { };

	// We don't listen for enter as we assume that we want the user to change the name before
	// re-attempting the create
	constructor(
		parentId: string,
		private errorMessage: string,
		private sectionNameInputValue: string,
		private onChangeBinded: (event: React.ChangeEvent<HTMLInputElement>) => void) {
		super(parentId);
	}

	element(): JSX.Element {
		return (
			<CreateNewSectionRowTemplate>
				<div className='picker-label'>
					<input
						className='create-input'
						type='text'
						placeholder={Strings.get('Input.CreateSectionPlaceholder')}
						autoComplete='off'
						value={this.sectionNameInputValue}
						onChange={this.onChangeBinded} />
				</div>
				<ErrorIconWithPopover errorMessage={this.errorMessage}></ErrorIconWithPopover>
			</CreateNewSectionRowTemplate>
		);
	}
}
