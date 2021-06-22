import { Movie } from '../../types';
import { memoize } from '../../lib';
import { isEmptyObject } from '../../utils';
import { scrapeMovieTrailer } from '../../actions';

const cachedFetchSafeResponse = memoize(scrapeMovieTrailer);

export async function movieTrailerRenderer({
	trailer
}: Movie): Promise<HTMLElement | undefined> {
	const trailerData = await cachedFetchSafeResponse(trailer['id']);

	if (trailerData && !isEmptyObject(trailerData)) {
		const video = document.createElement('video');
		video.tabIndex = -1;
		video.controls = true;
		video.loop = true;
		video.playsInline = true;
		video.className = 'video-player';

		const videoSource = video.appendChild(document.createElement('source'));
		videoSource.id = 'videoSource';
		videoSource.type = trailerData.mimeType;
		videoSource.src = trailerData.url;

		return video;
	}

	return;
}
