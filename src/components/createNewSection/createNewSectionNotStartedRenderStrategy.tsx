import * as React from 'react';

import { NodeRenderStrategy } from '../treeView/nodeRenderStrategy';
import { AddIconSvg } from '../icons/addIcon.svg';
import { Strings } from '../../strings';
import { CreateNewSectionCommonProperties } from './createNewSectionCommonProperties';

export class CreateNewSectionNotStartedRenderStrategy extends CreateNewSectionCommonProperties implements NodeRenderStrategy {
	onClickBinded = this.onClick;

	constructor(
		parentId: string,
		private onClick: () => void) {
		super(parentId);
	}

	element(): JSX.Element {
		return (
			<div className='section'>
				<div className='picker-icon'>
					<AddIconSvg />
				</div>
				<div className='picker-label'>
					<label className='create-label'>{Strings.get('Label.CreateSection')}</label>
				</div>
			</div>
		);
	}
}
