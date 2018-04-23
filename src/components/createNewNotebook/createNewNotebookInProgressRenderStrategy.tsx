import * as React from 'react';

import { NodeRenderStrategy } from '../treeView/nodeRenderStrategy';
import { SpinnerIconSvg } from '../icons/spinnerIcon.svg';
import { CreateNewNotebookCommonProperties } from './createNewNotebookCommonProperties';
import { CreateNewNotebookRowTemplate } from './createNewNotebookRowTemplate';

export class CreateNewNotebookInProgressRenderStrategy extends CreateNewNotebookCommonProperties implements NodeRenderStrategy {
	onClickBinded = () => { };

	constructor(private name: string) {
		super();
	}

	element(): JSX.Element {
		return (
			<CreateNewNotebookRowTemplate>
				<div className='picker-label'>
					<label>{this.name}</label>
					<div className='create-spinner'>
						<SpinnerIconSvg />
					</div>
				</div>
			</CreateNewNotebookRowTemplate>
		);
	}
}
