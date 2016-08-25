declare namespace OneNotePicker {
	export class OneNotePickerComponent {
		view();
		controller();
	}

	export class OneNotePickerDataSource {
		public data;
		public authToken;
		constructor(authToken: string);
		public onGetDataSuccess(notebooks: any);
		public onGetDataFailure(failureMessage: string);
		public getNotebooks(headers?: { [key: string]: string });
	}
}
