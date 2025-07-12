import React, { useState, useEffect } from 'react';

const UserProfile = ({ currentUser, setCurrentUser }) => {
  const [formData, setFormData] = useState({
    sex: '',
    birth_date: '',
    birth_time: '',
    birth_location: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        sex: currentUser.sex || '',
        birth_date: currentUser.birth_date || '',
        birth_time: currentUser.birth_time || '',
        birth_location: currentUser.birth_location || ''
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Fetch the complete user data
        const userResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${data.user_id}`);
        const userData = await userResponse.json();
        
        setCurrentUser(userData);
        setMessage('Perfil criado com sucesso!');
      } else {
        setMessage('Erro ao criar perfil. Tente novamente.');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      setMessage('Erro de conexão. Verifique sua internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-iris-600 to-primary-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">
              {currentUser ? 'Editar Perfil' : 'Criar Perfil Astrológico'}
            </h1>
            <p className="text-iris-100 mt-2">
              Precisamos dos seus dados de nascimento para criar o mapa astrológico
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Sex Selection */}
            <div className="form-field">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sexo
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative">
                  <input
                    type="radio"
                    name="sex"
                    value="M"
                    checked={formData.sex === 'M'}
                    onChange={handleInputChange}
                    className="sr-only"
                    required
                  />
                  <div className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${
                    formData.sex === 'M' 
                      ? 'border-iris-500 bg-iris-50 text-iris-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <div className="text-2xl mb-2">♂</div>
                    <div className="font-medium">Masculino</div>
                  </div>
                </label>
                <label className="relative">
                  <input
                    type="radio"
                    name="sex"
                    value="F"
                    checked={formData.sex === 'F'}
                    onChange={handleInputChange}
                    className="sr-only"
                    required
                  />
                  <div className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${
                    formData.sex === 'F' 
                      ? 'border-iris-500 bg-iris-50 text-iris-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <div className="text-2xl mb-2">♀</div>
                    <div className="font-medium">Feminino</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Birth Date */}
            <div className="form-field">
              <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-2">
                Data de Nascimento
              </label>
              <input
                type="date"
                id="birth_date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iris-500 focus:border-iris-500 transition-colors"
              />
            </div>

            {/* Birth Time */}
            <div className="form-field">
              <label htmlFor="birth_time" className="block text-sm font-medium text-gray-700 mb-2">
                Hora de Nascimento
              </label>
              <input
                type="time"
                id="birth_time"
                name="birth_time"
                value={formData.birth_time}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iris-500 focus:border-iris-500 transition-colors"
              />
              <p className="text-sm text-gray-500 mt-1">
                A hora exata é importante para calcular o ascendente
              </p>
            </div>

            {/* Birth Location */}
            <div className="form-field">
              <label htmlFor="birth_location" className="block text-sm font-medium text-gray-700 mb-2">
                Local de Nascimento
              </label>
              <input
                type="text"
                id="birth_location"
                name="birth_location"
                value={formData.birth_location}
                onChange={handleInputChange}
                placeholder="Ex: São Paulo, SP, Brasil"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iris-500 focus:border-iris-500 transition-colors"
              />
              <p className="text-sm text-gray-500 mt-1">
                Cidade, estado e país de nascimento
              </p>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes('sucesso') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-iris-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-iris-700 focus:ring-2 focus:ring-iris-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {currentUser ? 'Atualizando...' : 'Criando Perfil...'}
                </div>
              ) : (
                currentUser ? 'Atualizar Perfil' : 'Criar Perfil'
              )}
            </button>
          </form>

          {/* Info Section */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Por que precisamos dessas informações?
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>Data e Hora:</strong> Essenciais para calcular as posições planetárias no momento do seu nascimento
              </p>
              <p>
                <strong>Local:</strong> Necessário para determinar o ascendente e casas astrológicas
              </p>
              <p>
                <strong>Sexo:</strong> Influencia na interpretação de alguns aspectos astrológicos e iridológicos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;