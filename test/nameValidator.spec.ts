import { NameValidator } from '../src/nameValidator';

// TODO (machiam) There's something wrong with `npm run test`, so these aren't running
describe('NameValidator', () => {
	it('should allow alphanumeric notebook names', () => {
		expect(NameValidator.validateNotebookName('foo')).toBeFalsy();
		expect(NameValidator.validateNotebookName('hello world')).toBeFalsy();
		expect(NameValidator.validateNotebookName('hello world 123')).toBeFalsy();
		expect(NameValidator.validateNotebookName('123')).toBeFalsy();
	});

	it('should not allow empty or whitespace names', () => {
		expect(NameValidator.validateNotebookName('')).toBeTruthy();
		expect(NameValidator.validateNotebookName('  ')).toBeTruthy();
	});

	it('should not allow names beginning or ending with period', () => {
		expect(NameValidator.validateNotebookName('.hello')).toBeTruthy();
		expect(NameValidator.validateNotebookName('hello.')).toBeTruthy();
	});

	it('should not allow certain special characters', () => {
		expect(NameValidator.validateNotebookName('test ? character')).toBeTruthy();
		expect(NameValidator.validateNotebookName('test * character')).toBeTruthy();
		expect(NameValidator.validateNotebookName('test / character')).toBeTruthy();
		expect(NameValidator.validateNotebookName('test : character')).toBeTruthy();
		expect(NameValidator.validateNotebookName('test < character')).toBeTruthy();
		expect(NameValidator.validateNotebookName('test > character')).toBeTruthy();
		expect(NameValidator.validateNotebookName('test | character')).toBeTruthy();
		expect(NameValidator.validateNotebookName('test " character')).toBeTruthy();
		expect(NameValidator.validateNotebookName('test # character')).toBeTruthy();
		expect(NameValidator.validateNotebookName('test % character')).toBeTruthy();
	});
});
