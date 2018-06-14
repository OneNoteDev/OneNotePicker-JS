import * as React from 'react';

import { NodeRenderStrategy } from '../treeView/nodeRenderStrategy';
import { SpinnerIconSvg } from '../icons/spinnerIcon.svg';
import { CreateNewSectionCommonProperties } from './createNewSectionCommonProperties';
import { CreateNewSectionRowTemplate } from './createNewSectionRowTemplate';

export class CreateNewSectionInProgressRenderStrategy extends CreateNewSectionCommonProperties implements NodeRenderStrategy {
	onClickBinded = () => { };

	constructor(
		parentId: string,
		private name: string) {
		super(parentId);
	}

	element(): JSX.Element {
		return (
			<CreateNewSectionRowTemplate>
				<div className='picker-label'>
					<label>{this.name}</label>
				</div>
				<div className='create-spinner'>
					<SpinnerIconSvg />
				</div>
			</CreateNewSectionRowTemplate>
		);
	}
}
