import React, { useState } from 'react';
import { Upload, Leaf, Droplets, Bug, ChevronRight, TrendingUp, Shield } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('crop');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Form states
  const [cropForm, setCropForm] = useState({
    N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: ''
  });
  
  const [fertForm, setFertForm] = useState({
    temperature: '', humidity: '', moisture: '', soil_type: '', crop_type: '', N: '', P: '', K: ''
  });
  
  const [diseaseImage, setDiseaseImage] = useState(null);

  // NOTE: This API base URL assumes you have a backend server running locally on port 8000.
  const API_BASE = 'http://127.0.0.1:8000';

  const handleCropSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/predict/crop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          N: parseFloat(cropForm.N),
          P: parseFloat(cropForm.P),
          K: parseFloat(cropForm.K),
          temperature: parseFloat(cropForm.temperature),
          humidity: parseFloat(cropForm.humidity),
          ph: parseFloat(cropForm.ph),
          rainfall: parseFloat(cropForm.rainfall)
        })
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setResult({ error: data.error });
      }
      console.log('API Response for Crop:', data);
    } catch (error) {
      setResult({ error: 'Failed to get prediction' });
      console.error('API Error:', error);
    }
    setLoading(false);
  };

  const handleFertSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/predict/fertilizer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temperature: parseFloat(fertForm.temperature),
          humidity: parseFloat(fertForm.humidity),
          moisture: parseFloat(fertForm.moisture),
          soil_type: fertForm.soil_type,
          crop_type: fertForm.crop_type,
          N: parseFloat(fertForm.N),
          P: parseFloat(fertForm.P),
          K: parseFloat(fertForm.K)
        })
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setResult({ error: data.error });
      }
      console.log('API Response for Fertilizer:', data);
    } catch (error) {
      setResult({ error: 'Failed to get prediction' });
      console.error('API Error:', error);
    }
    setLoading(false);
  };

  const handleDiseaseSubmit = async () => {
    if (!diseaseImage) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', diseaseImage);
      
      const response = await fetch(`${API_BASE}/predict/disease`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setResult({ error: data.error });
      }
      console.log('API Response for Disease:', data);
    } catch (error) {
      setResult({ error: 'Failed to get prediction' });
      console.error('API Error:', error);
    }
    setLoading(false);
  };

  const inputClass = "w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all";
  const buttonClass = "w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium cursor-pointer";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 font-[Open Sans] antialiased">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AgriSmart AI</h1>
                <p className="text-sm text-gray-600">Intelligent Farming Solutions</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500 font-bold text-xl tracking-tighter">Ctrl <b>C</b></span>
              <span className="text-gray-500 font-bold text-xl tracking-tighter ml-1">+</span>
              <span className="text-gray-500 font-bold text-xl tracking-tighter ml-1">Ctrl <b>V</b></span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Agricultural Intelligence
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get personalized crop recommendations, fertilizer guidance, and disease detection 
            using advanced machine learning algorithms trained on agricultural data.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="flex items-center gap-2 text-green-700">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">95% Accuracy</span>
            </div>
            <div className="flex items-center gap-2 text-green-700">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Scientifically Validated</span>
            </div>
            <div className="flex items-center gap-2 text-green-700">
              <Leaf className="w-5 h-5" />
              <span className="font-medium">Sustainable Practices</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => { setActiveTab('crop'); setResult(null); }}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'crop' 
                ? 'bg-green-500 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-green-50 border border-green-200'
            }`}
          >
            <Leaf className="w-5 h-5" />
            Crop Recommendation
          </button>
          <button
            onClick={() => { setActiveTab('fertilizer'); setResult(null); }}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'fertilizer' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-blue-50 border border-blue-200'
            }`}
          >
            <Droplets className="w-5 h-5" />
            Fertilizer Guide
          </button>
          <button
            onClick={() => { setActiveTab('disease'); setResult(null); }}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'disease' 
                ? 'bg-orange-500 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-orange-50 border border-orange-200'
            }`}
          >
            <Bug className="w-5 h-5" />
            Disease Detection
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {activeTab === 'crop' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Crop Recommendation</h3>
                    <p className="text-gray-600">Find the best crop for your soil conditions</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nitrogen (N)</label>
                      <input
                        type="number"
                        className={inputClass}
                        value={cropForm.N}
                        onChange={(e) => setCropForm({...cropForm, N: e.target.value})}
                        placeholder="0-140"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phosphorus (P)</label>
                      <input
                        type="number"
                        className={inputClass}
                        value={cropForm.P}
                        onChange={(e) => setCropForm({...cropForm, P: e.target.value})}
                        placeholder="0-140"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Potassium (K)</label>
                      <input
                        type="number"
                        className={inputClass}
                        value={cropForm.K}
                        onChange={(e) => setCropForm({...cropForm, K: e.target.value})}
                        placeholder="0-200"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                      <input
                        type="number"
                        step="0.1"
                        className={inputClass}
                        value={cropForm.temperature}
                        onChange={(e) => setCropForm({...cropForm, temperature: e.target.value})}
                        placeholder="20-35"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Humidity (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        className={inputClass}
                        value={cropForm.humidity}
                        onChange={(e) => setCropForm({...cropForm, humidity: e.target.value})}
                        placeholder="20-95"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">pH Level</label>
                      <input
                        type="number"
                        step="0.1"
                        className={inputClass}
                        value={cropForm.ph}
                        onChange={(e) => setCropForm({...cropForm, ph: e.target.value})}
                        placeholder="4.0-8.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rainfall (mm)</label>
                      <input
                        type="number"
                        step="0.1"
                        className={inputClass}
                        value={cropForm.rainfall}
                        onChange={(e) => setCropForm({...cropForm, rainfall: e.target.value})}
                        placeholder="10-300"
                      />
                    </div>
                  </div>
                  
                  <button onClick={handleCropSubmit} disabled={loading} className={buttonClass}>
                    {loading ? 'Analyzing...' : 'Get Recommendation'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'fertilizer' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Droplets className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Fertilizer Recommendation</h3>
                    <p className="text-gray-600">Get optimal fertilizer suggestions</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                      <input
                        type="number"
                        step="0.1"
                        className={inputClass}
                        value={fertForm.temperature}
                        onChange={(e) => setFertForm({...fertForm, temperature: e.target.value})}
                        placeholder="20-35"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Humidity (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        className={inputClass}
                        value={fertForm.humidity}
                        onChange={(e) => setFertForm({...fertForm, humidity: e.target.value})}
                        placeholder="20-95"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Moisture (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        className={inputClass}
                        value={fertForm.moisture}
                        onChange={(e) => setFertForm({...fertForm, moisture: e.target.value})}
                        placeholder="10-50"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                      <select
                        className={inputClass}
                        value={fertForm.soil_type}
                        onChange={(e) => setFertForm({...fertForm, soil_type: e.target.value})}
                      >
                        <option value="">Select soil type</option>
                        <option value="Sandy">Sandy</option>
                        <option value="Loamy">Loamy</option>
                        <option value="Clayey">Clayey</option>
                        <option value="Black">Black</option>
                        <option value="Red">Red</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
                      <select
                        className={inputClass}
                        value={fertForm.crop_type}
                        onChange={(e) => setFertForm({...fertForm, crop_type: e.target.value})}
                      >
                        <option value="">Select crop</option>
                        <option value="Rice">Rice</option>
                        <option value="Wheat">Wheat</option>
                        <option value="Maize">Maize</option>
                        <option value="Sugarcane">Sugarcane</option>
                        <option value="Cotton">Cotton</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current N</label>
                      <input
                        type="number"
                        className={inputClass}
                        value={fertForm.N}
                        onChange={(e) => setFertForm({...fertForm, N: e.target.value})}
                        placeholder="0-140"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current P</label>
                      <input
                        type="number"
                        className={inputClass}
                        value={fertForm.P}
                        onChange={(e) => setFertForm({...fertForm, P: e.target.value})}
                        placeholder="0-140"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current K</label>
                      <input
                        type="number"
                        className={inputClass}
                        value={fertForm.K}
                        onChange={(e) => setFertForm({...fertForm, K: e.target.value})}
                        placeholder="0-200"
                      />
                    </div>
                  </div>
                  
                  <button onClick={handleFertSubmit} disabled={loading} className={buttonClass.replace('green', 'blue')}>
                    {loading ? 'Analyzing...' : 'Get Fertilizer Recommendation'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'disease' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Bug className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Plant Disease Detection</h3>
                    <p className="text-gray-600">Upload a plant image for disease analysis</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-orange-200 rounded-xl p-8 text-center hover:border-orange-300 transition-colors">
                    <Upload className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Plant Image</h4>
                    <p className="text-gray-600 mb-4">Choose a clear image of the plant leaf or affected area</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setDiseaseImage(e.target.files[0])}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                    {diseaseImage && (
                      <p className="mt-2 text-sm text-orange-600">Selected: {diseaseImage.name}</p>
                    )}
                  </div>
                  
                  <button onClick={handleDiseaseSubmit} disabled={loading || !diseaseImage} className={buttonClass.replace('green', 'orange')}>
                    {loading ? 'Analyzing Image...' : 'Detect Disease'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Results & Insights</h3>
            
            {!result && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === 'crop' && <Leaf className="w-10 h-10 text-gray-400" />}
                  {activeTab === 'fertilizer' && <Droplets className="w-10 h-10 text-gray-400" />}
                  {activeTab === 'disease' && <Bug className="w-10 h-10 text-gray-400" />}
                </div>
                <p className="text-gray-500">Submit your data to get AI-powered recommendations</p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {result.error ? (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-red-800 mb-2">Error</h4>
                    <p className="text-red-600">{result.error}</p>
                  </div>
                ) : (
                  <div>
                    {result.crop && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-green-800 mb-3">Recommended Crop</h4>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                            <Leaf className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-xl font-bold text-green-800 capitalize">{result.crop}</p>
                            {result.confidence && (
                              <p className="text-green-600">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {result.fertilizer && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-blue-800 mb-3">Recommended Fertilizer</h4>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                            <Droplets className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-xl font-bold text-blue-800">{result.fertilizer}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {result.disease && (
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-orange-800 mb-3">Disease Detection Result</h4>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                            <Bug className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-xl font-bold text-orange-800">{result.disease}</p>
                            {result.confidence && (
                              <p className="text-orange-600">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-16 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose AgriSmart AI?</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI models are trained on extensive agricultural datasets to provide accurate, 
              actionable insights for modern farming.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-green-50 border border-green-100">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Smart Crop Selection</h4>
              <p className="text-gray-600">
                Advanced algorithms analyze soil nutrients, climate, and environmental factors 
                to recommend the most suitable crops for maximum yield.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-blue-50 border border-blue-100">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Precision Fertilization</h4>
              <p className="text-gray-600">
                Get personalized fertilizer recommendations based on soil composition, 
                crop requirements, and current nutrient levels for optimal growth.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-orange-50 border border-orange-100">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bug className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Early Disease Detection</h4>
              <p className="text-gray-600">
                Upload plant images for instant disease identification using deep learning 
                models trained on thousands of plant pathology images.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            © 2025 AgriSmart AI. Empowering farmers with intelligent technology for sustainable agriculture.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
