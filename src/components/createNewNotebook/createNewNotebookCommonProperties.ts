import { Strings } from '../../strings';
import { Constants } from '../../constants';

export class CreateNewNotebookCommonProperties {
	getId(): string {
		return Constants.TreeView.createNewNotebookId;
	}

	getName(): string {
		return Strings.get('Label.CreateNotebook');
	}

	isSelected(): boolean {
		return false;
	}

	isAriaSelected(): boolean {
		return false;
	}
}
