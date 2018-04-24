import * as React from 'react';

import { NodeRenderStrategy } from '../treeView/nodeRenderStrategy';
import { AddIconSvg } from '../icons/addIcon.svg';
import { ChevronSvg } from '../icons/chevron.svg';
import { Strings } from '../../strings';
import { CreateNewNotebookCommonProperties } from './createNewNotebookCommonProperties';

export class CreateNewNotebookNotStartedRenderStrategy extends CreateNewNotebookCommonProperties implements NodeRenderStrategy {
	onClickBinded = this.onClick;

	constructor(private onClick: () => void) {
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
}
