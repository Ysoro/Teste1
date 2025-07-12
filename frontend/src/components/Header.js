import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ currentUser }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-iris-500 to-primary-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">IridoAstro</h1>
                <p className="text-xs text-gray-500">Análise Iridológica & Astrológica</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-iris-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/profile" 
              className="text-gray-600 hover:text-iris-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Perfil
            </Link>
            {currentUser && (
              <Link 
                to="/analysis" 
                className="text-gray-600 hover:text-iris-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Nova Análise
              </Link>
            )}
          </nav>

          {/* User Status */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-iris-100 rounded-full flex items-center justify-center">
                  <span className="text-iris-600 font-medium text-sm">
                    {currentUser.sex === 'M' ? '♂' : '♀'}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  Bem-vindo(a)!
                </span>
              </div>
            ) : (
              <Link 
                to="/profile"
                className="bg-iris-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-iris-700 transition-colors"
              >
                Criar Perfil
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            to="/" 
            className="text-gray-600 hover:text-iris-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Dashboard
          </Link>
          <Link 
            to="/profile" 
            className="text-gray-600 hover:text-iris-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Perfil
          </Link>
          {currentUser && (
            <Link 
              to="/analysis" 
              className="text-gray-600 hover:text-iris-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Nova Análise
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;