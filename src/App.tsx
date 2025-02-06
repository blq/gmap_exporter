import React, { useState, useEffect } from 'react';
import { Map, Download, ChevronDown } from 'lucide-react';

type ExportFormat = 'geojson' | 'gpx' | 'kml' | 'csv';

function App() {
  const [mapUrl, setMapUrl] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('geojson');
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false);

  const formats: { value: ExportFormat; label: string }[] = [
    { value: 'geojson', label: 'GeoJSON' },
    { value: 'gpx', label: 'GPX' },
    { value: 'kml', label: 'KML' },
    { value: 'csv', label: 'CSV' }
  ];

  useEffect(() => {
    // Handle shared URLs
    const params = new URLSearchParams(window.location.search);
    const sharedUrl = params.get('url');
    if (sharedUrl) {
      setMapUrl(sharedUrl);
      // Clean up the URL
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  const handleExport = () => {
    // Handle export logic here
    console.log(`Exporting ${mapUrl} as ${selectedFormat}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Map className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Google Maps Export Tool
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert Google Maps location links to your preferred format. Simply paste your link and choose your export format.
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="space-y-6">
            {/* URL Input */}
            <div>
              <label htmlFor="mapUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps URL
              </label>
              <input
                type="url"
                id="mapUrl"
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                placeholder="Paste your Google Maps link here"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Format Selector and Export Button */}
            <div className="flex gap-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFormatMenuOpen(!isFormatMenuOpen)}
                  className="inline-flex items-center justify-between w-40 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {formats.find(f => f.value === selectedFormat)?.label}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>

                {isFormatMenuOpen && (
                  <div className="absolute z-10 w-40 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {formats.map((format) => (
                      <button
                        key={format.value}
                        onClick={() => {
                          setSelectedFormat(format.value);
                          setIsFormatMenuOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-50 hover:text-blue-700 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {format.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleExport}
                disabled={!mapUrl}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Multiple Formats',
              description: 'Export your location data in GeoJSON, GPX, KML, or CSV format'
            },
            {
              title: 'Simple to Use',
              description: 'Just paste your Google Maps link and choose your preferred format'
            },
            {
              title: 'Instant Download',
              description: 'Get your converted file immediately, no sign-up required'
            }
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;