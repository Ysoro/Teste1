import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ currentUser }) => {
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchUserReports();
    }
  }, [currentUser]);

  const fetchUserReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reports/user/${currentUser.id}`);
      const data = await response.json();
      setRecentReports(data.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Descubra os Segredos dos
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-iris-600 to-primary-600">
                Seus Olhos
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Combinamos análise iridológica avançada com insights astrológicos para criar 
              um mapa completo da sua saúde e personalidade.
            </p>
            
            {!currentUser ? (
              <div className="space-y-4">
                <Link 
                  to="/profile"
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-iris-600 hover:bg-iris-700 transition-all duration-200 transform hover:scale-105"
                >
                  Começar Análise
                  <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <p className="text-sm text-gray-500">
                  Primeiro, vamos criar seu perfil astrológico
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Link 
                  to="/analysis"
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-iris-600 hover:bg-iris-700 transition-all duration-200 transform hover:scale-105"
                >
                  Nova Análise
                  <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </Link>
                <p className="text-sm text-gray-500">
                  Pronto para uma nova análise, {currentUser.sex === 'M' ? 'seja bem-vindo' : 'seja bem-vinda'}!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Decorative background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-iris-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Iridology Feature */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-iris-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-iris-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Análise Iridológica</h3>
            <p className="text-gray-600">
              Análise detalhada da íris para identificar padrões de saúde, 
              constituição física e predisposições.
            </p>
          </div>

          {/* Astrology Feature */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2L13.09 8.26L20 9L14 14.74L15.18 21.02L10 18L4.82 21.02L6 14.74L0 9L6.91 8.26L10 2Z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Insights Astrológicos</h3>
            <p className="text-gray-600">
              Mapeamento astrológico baseado em data, hora e local de nascimento 
              para análise de personalidade e saúde.
            </p>
          </div>

          {/* Report Feature */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Relatório Integrado</h3>
            <p className="text-gray-600">
              Relatório completo combinando análise iridológica e astrológica 
              com recomendações personalizadas.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Reports Section */}
      {currentUser && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Suas Análises Recentes</h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-iris-600"></div>
              </div>
            ) : recentReports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentReports.map((report) => (
                  <Link 
                    key={report.id}
                    to={`/report/${report.id}`}
                    className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500">
                        {new Date(report.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="bg-iris-100 text-iris-800 text-xs px-2 py-1 rounded">
                        Completo
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Análise Iridológica & Astrológica
                    </h3>
                    <p className="text-sm text-gray-600">
                      Relatório completo com insights personalizados
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-500 mb-4">Você ainda não tem análises</p>
                <Link 
                  to="/analysis"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-iris-600 hover:bg-iris-700"
                >
                  Fazer Primeira Análise
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;