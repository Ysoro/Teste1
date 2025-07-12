import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ReportView = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reports/${reportId}`);
      
      if (!response.ok) {
        throw new Error('Relatório não encontrado');
      }
      
      const data = await response.json();
      setReport(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;
    
    const element = document.createElement("a");
    const file = new Blob([report.combined_insights], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `relatorio-iridologia-${new Date(report.created_at).toLocaleDateString('pt-BR').replace(/\//g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iris-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando relatório...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erro ao carregar relatório</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-iris-600 hover:bg-iris-700"
          >
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-iris-600 to-primary-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Relatório de Análise Iridológica & Astrológica
                </h1>
                <p className="text-iris-100">
                  Gerado em {new Date(report.created_at).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={downloadReport}
                  className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download
                </button>
                <Link
                  to="/"
                  className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  Voltar
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="space-y-8">
          
          {/* Iridology Analysis */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-iris-50 px-6 py-4 border-b border-iris-100">
              <h2 className="text-xl font-bold text-iris-900 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                </svg>
                Análise Iridológica
              </h2>
            </div>
            <div className="p-6 space-y-6">
              
              {/* Constitution */}
              <div className="analysis-card bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Constituição Iridológica</h3>
                <p className="text-gray-700">{report.iridology_analysis.iris_constitution}</p>
              </div>

              {/* Weaknesses */}
              <div className="analysis-card bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Áreas de Atenção</h3>
                <div className="flex flex-wrap gap-2">
                  {report.iridology_analysis.constitutional_weakness.map((weakness, index) => (
                    <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                      {weakness}
                    </span>
                  ))}
                </div>
              </div>

              {/* Organ Zones */}
              <div className="analysis-card bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Análise por Órgãos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(report.iridology_analysis.organ_zones).map(([organ, condition]) => (
                    <div key={organ} className="bg-white p-3 rounded border">
                      <div className="font-medium text-gray-900 capitalize">{organ}</div>
                      <div className="text-sm text-gray-600">{condition}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Iris Markings */}
              <div className="analysis-card bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Marcas da Íris</h3>
                <ul className="space-y-1">
                  {report.iridology_analysis.iris_markings.map((marking, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <span className="w-2 h-2 bg-iris-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {marking}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="analysis-card bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">Recomendações Iridológicas</h3>
                <ul className="space-y-1">
                  {report.iridology_analysis.recommendations.map((rec, index) => (
                    <li key={index} className="text-green-800 flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Astrology Analysis */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-primary-50 px-6 py-4 border-b border-primary-100">
              <h2 className="text-xl font-bold text-primary-900 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L13.09 8.26L20 9L14 14.74L15.18 21.02L10 18L4.82 21.02L6 14.74L0 9L6.91 8.26L10 2Z" />
                </svg>
                Análise Astrológica
              </h2>
            </div>
            <div className="p-6 space-y-6">
              
              {/* Main Signs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="analysis-card bg-yellow-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">☉</div>
                  <div className="font-semibold text-gray-900">Sol</div>
                  <div className="text-yellow-700">{report.astrology_analysis.sun_sign}</div>
                </div>
                <div className="analysis-card bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">☽</div>
                  <div className="font-semibold text-gray-900">Lua</div>
                  <div className="text-blue-700">{report.astrology_analysis.moon_sign}</div>
                </div>
                <div className="analysis-card bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">↗</div>
                  <div className="font-semibold text-gray-900">Ascendente</div>
                  <div className="text-purple-700">{report.astrology_analysis.rising_sign}</div>
                </div>
              </div>

              {/* Planetary Positions */}
              <div className="analysis-card bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Posições Planetárias</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.entries(report.astrology_analysis.planetary_positions).map(([planet, sign]) => (
                    <div key={planet} className="bg-white p-3 rounded border text-center">
                      <div className="font-medium text-gray-900 capitalize">{planet}</div>
                      <div className="text-sm text-gray-600">{sign}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Health Aspects */}
              <div className="analysis-card bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <h3 className="font-semibold text-indigo-900 mb-2">Aspectos de Saúde Astrológicos</h3>
                <ul className="space-y-2">
                  {report.astrology_analysis.health_aspects.map((aspect, index) => (
                    <li key={index} className="text-indigo-800 flex items-start">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {aspect}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Constitution Analysis */}
              <div className="analysis-card bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Constituição Astrológica</h3>
                <p className="text-gray-700">{report.astrology_analysis.constitution_analysis}</p>
              </div>

              {/* Astro Recommendations */}
              <div className="analysis-card bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Recomendações Astrológicas</h3>
                <ul className="space-y-1">
                  {report.astrology_analysis.health_recommendations.map((rec, index) => (
                    <li key={index} className="text-blue-800 flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Combined Insights */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-iris-600 to-primary-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                </svg>
                Relatório Integrado
              </h2>
            </div>
            <div className="p-6">
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {report.combined_insights}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/analysis"
            className="bg-iris-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-iris-700 transition-colors"
          >
            Nova Análise
          </Link>
          <button
            onClick={downloadReport}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportView;