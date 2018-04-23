export class Strings {
	private static defaults: {} = {
		'Shared': 'Shared',
		'Error.4XX': 'You no longer have access to this notebook.',
		'Error.5XX': 'Something went wrong on our end.',
		'Error.Fallback': 'Something went wrong.',
		'Error.ValidateNotebookName.NotebookNameDotMessage': 'Notebook name cannot begin or end with a dot.',
		'Error.ValidateNotebookName.LengthLimitMessage': 'Notebook name must be less than {0} characters.',
		'Error.ValidateNotebookName.ContainsInvalidCharacterMessage': 'Notebook name contains invalid character: {0}',
		'Error.ValidateSectionName.SectionNameDotMessage': 'Section name cannot begin or end with a dot.',
		'Error.ValidateSectionName.LengthLimitMessage': 'Section name must be less than {0} characters.',
		'Error.ValidateSectionName.ContainsInvalidCharacterMessage': 'Section name contains invalid character: {0}',
		'Accessibility.NotebookIcon': 'Notebook Icon',
		'Accessibility.SectionGroupIcon': 'Section Group Icon',
		'Accessibility.SectionIcon': 'Section Icon',
		'Accessibility.PickerTableName': 'Save Locations',
		'Accessibility.PageIcon': 'Page Icon',
		'Label.CreateNotebook': 'Create New Notebook',
		'Label.CreateSection': 'Create New Section',
		'Input.CreateNotebookPlaceholder': 'Untitled Notebook',
		'Input.CreateSectionPlaceholder': 'Untitled Section'
	};

	static get(key: string, overrides?: {}): string {
		overrides = overrides || {};
		return overrides[key] || this.defaults[key] || '';
	}

	static getError(responseCode: number, overrides?: {}) {
		const responseStr = responseCode + '';
		if (responseStr.indexOf('4') === 0) {
			return this.get('Error.4XX', overrides);
		}
		if (responseStr.indexOf('5') === 0) {
			return this.get('Error.5XX', overrides);
		}
		return this.get('Error.Fallback', overrides);
	}
}
