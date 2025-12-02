import React, { useState, useEffect } from 'react';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';
import { getUsers, createUser, updateUser, deleteUser } from './services/api';

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError('Error al cargar usuarios. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Creando usuario:', userData);
      await createUser(userData);
      await loadUsers();
      setEditingUser(null);
    } catch (err) {
      const errorMessage = err.message || 'Error al crear usuario. Por favor, intenta de nuevo.';
      setError(errorMessage);
      console.error('Error completo:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userData) => {
    if (!editingUser) return;
    
    setLoading(true);
    setError(null);
    try {
      await updateUser(editingUser.id, userData);
      await loadUsers();
      setEditingUser(null);
    } catch (err) {
      setError('Error al actualizar usuario. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      setError('Error al eliminar usuario. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleFormSubmit = (userData) => {
    if (editingUser) {
      handleUpdateUser(userData);
    } else {
      handleCreateUser(userData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Gestión de Usuarios
        </h1>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <UserForm
              user={editingUser}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelEdit}
            />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Lista de Usuarios</h2>
                {loading && (
                  <div className="text-indigo-600 font-medium">Cargando...</div>
                )}
              </div>
              <UserTable
                users={users}
                onEdit={handleEdit}
                onDelete={handleDeleteUser}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

