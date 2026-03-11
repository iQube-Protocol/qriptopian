export function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

export function getYouTubeEmbedUrl(url: string, options?: { loop?: boolean }): string {
  let embedUrl = '';
  
  // Handle youtu.be short links
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }
  // Handle youtube.com/watch?v= links
  else if (url.includes('youtube.com/watch')) {
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get('v');
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }
  // Handle youtube.com/embed links (already in correct format)
  else if (url.includes('youtube.com/embed')) {
    embedUrl = url;
  }
  else {
    return url;
  }
  
  // Append loop parameter if requested
  if (options?.loop) {
    const separator = embedUrl.includes('?') ? '&' : '?';
    // YouTube loop requires playlist param with same video ID for single-video loop
    const videoId = embedUrl.split('/embed/')[1]?.split('?')[0];
    embedUrl += `${separator}loop=1&playlist=${videoId}`;
  }
  
  return embedUrl;
}
