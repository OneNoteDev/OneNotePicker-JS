export module Utils {
	/*
	 * Returns the relative path to the images directory.
	 * Also, since Chromebook has case-sensitive urls, we always go with lowercase image names
	 * (see the use of "lowerCasePathName" in gulpfile.js where the images names are lower-cased when copied)
	 */
	export function getImageResourceUrl(imageName: string) {
		return ("images/" + imageName).toLowerCase();
	}
}
