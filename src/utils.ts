/**
 * talk to local dev API or prod
 */
export function isLocalMode(): boolean {
  // or maybe use port nr?
  return new URLSearchParams(location.search).has('local');
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

// Extract filename from Content-Disposition header if available.
export function filenameFromResponseHeader(
  response: Response,
  { argname = 'filename' } = {}
): string | null {
  let filename = null;
  const disposition = response.headers.get('Content-Disposition');
  if (disposition && disposition.includes(argname + '=')) {
    // This regex matches both quoted and unquoted filenames.
    const filenameMatch = disposition.match(
      new RegExp(`${argname}\\*?=(?:UTF-8'')?"?([^;\r\n"]+)`, 'i')
    );
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1].replace(/["']/g, '');
    }
  }
  return filename;
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(blobUrl);
  a.remove();
}

// another tiny convenience function, worth it?
export async function triggerDownloadResponseAsFile(
  response: Response,
  { fallbackFilename = 'download' } = {}
): Promise<void> {
  const filename = filenameFromResponseHeader(response) || fallbackFilename;
  const blob = await response.blob();
  triggerBlobDownload(blob, filename);
}
