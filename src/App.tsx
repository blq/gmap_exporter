import React, { useState, useEffect } from 'react';
import { Map, Download, ChevronDown } from 'lucide-react';
import { ErrorMessage } from './components/ErrorMessage';
import {
  isLocalMode,
  filenameFromResponseHeader,
  isValidUrl,
  triggerBlobDownload,
  triggerDownloadResponseAsFile,
} from './utils';

type ExportFormat = 'geojson' | 'gpx' | 'kml' | 'kmz' | 'csv';

function App() {
  const [mapUrl, setMapUrl] = useState('');

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(() => {
    const savedFormat = localStorage.getItem('selectedFormat');
    return (savedFormat as ExportFormat) || 'geojson';
  });

  useEffect(() => {
    localStorage.setItem('selectedFormat', selectedFormat);
  }, [selectedFormat]);

  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const formats: { value: ExportFormat; label: string }[] = [
    { value: 'geojson', label: 'GeoJSON' },
    { value: 'gpx', label: 'GPX' },
    { value: 'kml', label: 'KML' },
    { value: 'kmz', label: 'KMZ' },
    { value: 'csv', label: 'CSV' },
  ];

  useEffect(() => {
    // Handle shared URLs
    const params = new URLSearchParams(window.location.search);
    const sharedUrl = params.get('url'); // || urlParams.get('text'); ?
    if (sharedUrl) {
      setMapUrl(sharedUrl);
      // todo: option to immediately trigger download? (if possible)
      // Clean up the URL
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  const handleExport = async () => {
    console.log(`Exporting ${mapUrl} as ${selectedFormat}`);

    try {
      setIsExporting(true);
      setError(null);

      if (!isValidUrl(mapUrl)) {
        throw new Error('Please enter a valid URL');
      }
      const url = new URL(mapUrl);
      if (!(url.href.includes('google.com/maps') || url.href.includes('maps.app.goo.gl/'))) {
        throw new Error('Please enter a valid Google Maps URL');
      }

      const baseUrl = isLocalMode()
        ? 'http://127.0.0.1:8787'
        : 'https://livetrack.fblomqvist.workers.dev';

      const response = await fetch(
        `${baseUrl}/exportGoogleFavs?format=${selectedFormat}&url=${encodeURIComponent(mapUrl)}`
      );
      if (!response.ok) {
        throw new Error('Failed to export location data');
      }

      triggerDownloadResponseAsFile(response, {
        fallbackFilename: `google_maps_favorites.${selectedFormat}`,
      });

      // Clear any previous errors
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 flex items-center justify-center">
            <Map className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Google Maps Export Tool</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Convert Google Maps location links to your preferred format. Simply paste your link and
            choose your export format.
          </p>
        </div>

        {/* Main Form */}
        <div className="rounded-xl bg-white p-8 shadow-xl">
          <div className="space-y-6">
            {/* URL Input */}
            <div>
              <label htmlFor="mapUrl" className="mb-2 block text-sm font-medium text-gray-700">
                Google Maps URL
              </label>
              <input
                type="url"
                id="mapUrl"
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                placeholder="Paste your Google Maps link here"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                disabled={isExporting}
              />
            </div>

            {/* Format Selector and Export Button */}
            <div className="flex gap-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFormatMenuOpen(!isFormatMenuOpen)}
                  disabled={isExporting}
                  className="inline-flex w-40 items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {formats.find((f) => f.value === selectedFormat)?.label}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>

                {isFormatMenuOpen && !isExporting && (
                  <div className="absolute z-10 mt-2 w-40 rounded-lg border border-gray-300 bg-white shadow-lg">
                    {formats.map((format) => (
                      <button
                        key={format.value}
                        onClick={() => {
                          setSelectedFormat(format.value);
                          setIsFormatMenuOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 first:rounded-t-lg last:rounded-b-lg hover:bg-blue-50 hover:text-blue-700"
                      >
                        {format.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleExport}
                disabled={!mapUrl || isExporting}
                className="inline-flex flex-1 items-center justify-center rounded-lg border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="mr-2 h-5 w-5" />
                Export
              </button>
            </div>

            {/* Error Message */}
            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: 'Multiple Formats',
              description: 'Export your location data in GeoJSON, GPX, KML/KMZ, or CSV format',
            },
            {
              title: 'Simple to Use',
              description: 'Just paste your Google Maps link and choose your preferred format',
            },
            {
              title: 'Instant Download',
              description: 'Get your converted file immediately, no sign-up required',
            },
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
