import { Strings } from './strings';

export class NameValidator {
	private static maxNotebookNameLength: number = 128;

	private static InvalidNotebookNameCharactersRegex: RegExp = new RegExp('[' + String.fromCharCode(
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
		21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 127
	) + '?*\\/:<>|"#%' + ']');

	static validateNotebookName(name: string): string | undefined {
		if (/^\./.test(name) || /\.$/.test(name)) {
			return Strings.get('Error.ValidateNotebookName.NotebookNameDotMessage');
		}

		if (name.length > NameValidator.maxNotebookNameLength) {
			const message = Strings.get('Error.ValidateNotebookName.LengthLimitMessage');
			return message.replace('{0}', '' + NameValidator.maxNotebookNameLength);
		}

		let matchesArray = name.match(this.InvalidNotebookNameCharactersRegex);
		if (matchesArray && matchesArray.length > 0) {
			const message = Strings.get('Error.ValidateNotebookName.ContainsInvalidCharacterMessage');
			return message.replace('{0}', matchesArray[0]);
		}

		return undefined;
	}
}
