import * as React from 'react';

import { NodeRenderStrategy } from '../treeView/nodeRenderStrategy';
import { AddIconSvg } from '../icons/addIcon.svg';
import { Strings } from '../../strings';
import { CreateNewSectionCommonProperties } from './createNewSectionCommonProperties';
import { CreateNewSectionNodeProps } from './createNewSectionNode';

export class CreateNewSectionNotStartedRenderStrategy extends CreateNewSectionCommonProperties implements NodeRenderStrategy {
	onClickBinded = this.onClickSectionInput.bind(this);

	constructor(
		parentId: string,
		private onClick: () => void,
		private props: CreateNewSectionNodeProps) {
		super(parentId);
	}

	element(): JSX.Element {
		return (
			<div className='section input-not-started'>
				<div className='picker-icon'>
					<AddIconSvg />
				</div>
				<div className='picker-label'>
					<label className='create-label'>{Strings.get('Label.CreateSection')}</label>
				</div>
			</div>
		);
	}

	private onClickSectionInput(): void {
		const onSectionInputSelected = this.props.callbacks.onSectionInputSelected;
		if (!!onSectionInputSelected) {
			onSectionInputSelected(this.props.parent, this.props.parentIsNotebook, '');
		}
		this.onClick()
	}
}
