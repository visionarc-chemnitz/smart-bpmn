import React, { useState } from "react";

interface UpdateNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

const UpdateNameModal: React.FC<UpdateNameModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim() === "") {
      setError("Display name is required to access dashboard");
      return;
    }
    onSave(name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg transition-all duration-300">
      <div className="w-[400px] p-6 bg-white border rounded-lg shadow-lg transform transition-all duration-300 scale-100 hover:scale-105 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-blue-500 dark:text-blue-300">Set Your Display Name to Continue</h2>
        <form className="space-y-4" onSubmit={handleSave}>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(""); // Clear error message on input change
            }}
            className="w-full mt-3 p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-300 shadow-md"
            placeholder="Enter your name"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-black shadow-lg"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateNameModal;