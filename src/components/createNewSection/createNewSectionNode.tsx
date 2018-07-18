import * as React from 'react';

import { Notebook } from '../../oneNoteDataStructures/notebook';
import { SectionGroup } from '../../oneNoteDataStructures/sectionGroup';
import { NodeRenderStrategy } from '../treeView/nodeRenderStrategy';
import { CreateNewSectionNotStartedRenderStrategy } from './createNewSectionNotStartedRenderStrategy';
import { CreateNewSectionInputRenderStrategy } from './createNewSectionInputRenderStrategy';
import { CreateNewSectionInProgressRenderStrategy } from './createNewSectionInProgressRenderStrategy';
import { CreateNewSectionErrorRenderStrategy } from './createNewSectionErrorRenderStrategy';
import { InnerGlobals } from '../../props/globalProps';
import { CreateEntityNode } from '../treeView/createEntityNode';

export interface CreateNewSectionNodeProps extends InnerGlobals {
	level: number;
	tabbable: boolean;
	parent: Notebook | SectionGroup;
	parentIsNotebook: boolean;
}

/**
 * Presentation component that extends the 'Create' UX with section-specific
 * UI.
 */
export class CreateNewSectionNode extends React.Component<CreateNewSectionNodeProps, {}> {
	constructor(props: CreateNewSectionNodeProps) {
		super(props);

		this.notStartedRenderStrategy = this.notStartedRenderStrategy.bind(this);
		this.inputRenderStrategy = this.inputRenderStrategy.bind(this);
		this.createErrorRenderStrategy = this.createErrorRenderStrategy.bind(this);
		this.inProgressRenderStrategy = this.inProgressRenderStrategy.bind(this);
		this.createSection = this.createSection.bind(this);
	}

	private notStartedRenderStrategy(onClick: () => void): NodeRenderStrategy {
		return new CreateNewSectionNotStartedRenderStrategy(this.props.parent.id, onClick, this.props);
	}

	private inputRenderStrategy(
		inputValue: string,
		onEnter: () => void,
		onInputChange: (evt: React.ChangeEvent<HTMLInputElement>) => void,
		setInputRefAndFocus: (node: HTMLInputElement) => void): NodeRenderStrategy {
		return new CreateNewSectionInputRenderStrategy(this.props.parent.id, inputValue, this.props, onEnter, onInputChange, setInputRefAndFocus);
	}

	private createErrorRenderStrategy(errorMessage: string, inputValue: string, onInputChange: (evt: React.ChangeEvent<HTMLInputElement>) => void): NodeRenderStrategy {
		return new CreateNewSectionErrorRenderStrategy(this.props.parent.id, errorMessage, inputValue, onInputChange);
	}

	private inProgressRenderStrategy(inputValue: string): NodeRenderStrategy {
		return new CreateNewSectionInProgressRenderStrategy(this.props.parent.id, inputValue);
	}

	private createSection(name: string): Promise<void> {
		const createSectionPromise = this.props.parentIsNotebook ?
			this.props.oneNoteDataProvider!.createSectionUnderNotebook(this.props.parent as Notebook, name) :
			this.props.oneNoteDataProvider!.createSectionUnderSectionGroup(this.props.parent as SectionGroup, name);

		return createSectionPromise.then((section) => {
			return this.props.callbacks.onSectionCreated!(section);
		});
	}

	render() {
		return (
			<CreateEntityNode
				{...this.props}
				notStartedRenderStrategy={this.notStartedRenderStrategy}
				inputRenderStrategy={this.inputRenderStrategy}
				createErrorRenderStrategy={this.createErrorRenderStrategy}
				inProgressRenderStrategy={this.inProgressRenderStrategy}
				createEntity={this.props.callbacks.onSectionCreated ? this.createSection : undefined}>
			</CreateEntityNode>
		);
	}
}
