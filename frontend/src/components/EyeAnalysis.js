import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const EyeAnalysis = ({ currentUser, setCurrentAnalysis }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('upload'); // 'upload', 'analyzing', 'complete'
  const [analysisResults, setAnalysisResults] = useState(null);
  const [reportId, setReportId] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 5MB.');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const event = { target: { files: [file] } };
      handleFileSelect(event);
    }
  };

  const startAnalysis = async () => {
    if (!selectedFile) {
      alert('Por favor, selecione uma imagem do olho.');
      return;
    }

    setLoading(true);
    setAnalysisStep('analyzing');

    try {
      // Step 1: Upload image
      const formData = new FormData();
      formData.append('user_id', currentUser.id);
      formData.append('eye_image', selectedFile);

      const uploadResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/upload-eye-image`, {
        method: 'POST',
        body: formData
      });

      const uploadData = await uploadResponse.json();
      
      if (!uploadData.success) {
        throw new Error('Erro no upload da imagem');
      }

      const analysisId = uploadData.analysis_id;
      setCurrentAnalysis({ id: analysisId });

      // Step 2: Perform iridology analysis
      const analysisResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/analyze-iridology/${analysisId}`, {
        method: 'POST'
      });

      const analysisData = await analysisResponse.json();
      
      if (!analysisData.success) {
        throw new Error('Erro na análise iridológica');
      }

      setAnalysisResults(analysisData.analysis_results);

      // Step 3: Generate combined report
      const reportFormData = new FormData();
      reportFormData.append('user_id', currentUser.id);
      reportFormData.append('analysis_id', analysisId);

      const reportResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/generate-report`, {
        method: 'POST',
        body: reportFormData
      });

      const reportData = await reportResponse.json();
      
      if (!reportData.success) {
        throw new Error('Erro na geração do relatório');
      }

      setReportId(reportData.report_id);
      setAnalysisStep('complete');

    } catch (error) {
      console.error('Analysis error:', error);
      alert('Erro durante a análise. Tente novamente.');
      setAnalysisStep('upload');
    } finally {
      setLoading(false);
    }
  };

  const viewReport = () => {
    if (reportId) {
      navigate(`/report/${reportId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Análise Iridológica
          </h1>
          <p className="text-lg text-gray-600">
            Faça o upload de uma foto clara do seu olho para análise completa
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${analysisStep === 'upload' ? 'text-iris-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                analysisStep === 'upload' ? 'border-iris-600' : 'border-green-600 bg-green-600 text-white'
              }`}>
                {analysisStep === 'upload' ? '1' : '✓'}
              </div>
              <span className="ml-2 font-medium">Upload da Imagem</span>
            </div>
            
            <div className="w-16 h-0.5 bg-gray-300"></div>
            
            <div className={`flex items-center ${
              analysisStep === 'analyzing' ? 'text-iris-600' : 
              analysisStep === 'complete' ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                analysisStep === 'analyzing' ? 'border-iris-600' : 
                analysisStep === 'complete' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'
              }`}>
                {analysisStep === 'complete' ? '✓' : '2'}
              </div>
              <span className="ml-2 font-medium">Análise</span>
            </div>
            
            <div className="w-16 h-0.5 bg-gray-300"></div>
            
            <div className={`flex items-center ${analysisStep === 'complete' ? 'text-iris-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                analysisStep === 'complete' ? 'border-iris-600' : 'border-gray-300'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Relatório</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          
          {/* Upload Section */}
          {analysisStep === 'upload' && (
            <div className="p-8">
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center file-upload-area ${
                  preview ? 'border-iris-300 bg-iris-50' : 'border-gray-300 hover:border-iris-400'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {preview ? (
                  <div className="space-y-4">
                    <img 
                      src={preview} 
                      alt="Preview do olho" 
                      className="max-w-xs max-h-64 mx-auto rounded-lg shadow-lg"
                    />
                    <div>
                      <p className="text-iris-600 font-medium">Imagem selecionada!</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm text-iris-600 hover:text-iris-700 underline"
                      >
                        Escolher outra imagem
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <svg className="w-16 h-16 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Arraste uma imagem aqui ou clique para selecionar
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG ou JPEG até 5MB
                      </p>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-iris-600 text-white px-6 py-2 rounded-lg hover:bg-iris-700 transition-colors"
                    >
                      Selecionar Arquivo
                    </button>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Instructions */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-medium text-blue-900 mb-3">Dicas para uma boa foto:</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Use boa iluminação natural</li>
                  <li>• Mantenha o olho bem aberto</li>
                  <li>• Foto próxima e focada na íris</li>
                  <li>• Evite flash direto</li>
                  <li>• Use a câmera frontal ou peça ajuda</li>
                </ul>
              </div>

              {/* Start Analysis Button */}
              {selectedFile && (
                <div className="mt-6 text-center">
                  <button
                    onClick={startAnalysis}
                    disabled={loading}
                    className="bg-iris-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-iris-700 focus:ring-2 focus:ring-iris-500 focus:ring-offset-2 transition-all disabled:opacity-50"
                  >
                    Iniciar Análise
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Analysis Loading */}
          {analysisStep === 'analyzing' && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-iris-600 mx-auto mb-6"></div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Analisando sua íris...
              </h3>
              <p className="text-gray-600">
                Estamos processando a imagem e gerando seu relatório astrológico. 
                Isso pode levar alguns momentos.
              </p>
            </div>
          )}

          {/* Analysis Complete */}
          {analysisStep === 'complete' && analysisResults && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Análise Completa!
                </h3>
                <p className="text-gray-600">
                  Sua análise iridológica e astrológica foi concluída com sucesso.
                </p>
              </div>

              {/* Quick Results Preview */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Resumo da Análise:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Constituição:</strong> {analysisResults.iris_constitution}
                  </div>
                  <div>
                    <strong>Áreas de atenção:</strong> {analysisResults.constitutional_weakness.join(', ')}
                  </div>
                </div>
              </div>

              {/* View Report Button */}
              <div className="text-center">
                <button
                  onClick={viewReport}
                  className="bg-iris-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-iris-700 focus:ring-2 focus:ring-iris-500 focus:ring-offset-2 transition-all"
                >
                  Ver Relatório Completo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EyeAnalysis;