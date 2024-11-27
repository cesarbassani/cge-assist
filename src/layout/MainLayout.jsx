const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4">
        <h1 className="text-xl font-bold text-gray-800">CGE Assist</h1>
        <p className="text-sm text-gray-500">Assistente Inteligente CGE/GO</p>
        
        {/* Upload Button */}
        <button className="w-full mt-6 p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
          Carregar Documentos
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;