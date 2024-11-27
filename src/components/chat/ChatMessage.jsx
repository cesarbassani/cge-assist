import React from 'react';

export default function ChatMessage({ role, content, sources }) {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-2xl rounded-lg p-4 ${
        role === 'user' 
          ? 'bg-blue-600 text-white' 
          : 'bg-white border shadow-sm'
      }`}>
        <p className="whitespace-pre-wrap">{content}</p>
        {sources && sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
            <p className="font-medium text-gray-500">Fontes:</p>
            {sources.map((source, idx) => (
              <p key={idx} className={`${role === 'user' ? 'text-blue-200' : 'text-blue-600'}`}>
                {source}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}