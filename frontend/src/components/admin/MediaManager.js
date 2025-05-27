import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ENDPOINTS, getImageUrl } from '../../constants';
import { Delete, Edit, Add, PlayCircle } from '@mui/icons-material';

const MediaManager = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'image',
    file: null
  });

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await axios.get(ENDPOINTS.MEDIA);
      setMedia(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch media');
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      file,
      type: file.type.startsWith('video/') ? 'video' : 'image'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (selectedMedia) {
        await axios.put(`${ENDPOINTS.MEDIA}/${selectedMedia._id}`, formDataToSend);
      } else {
        await axios.post(ENDPOINTS.MEDIA, formDataToSend);
      }

      fetchMedia();
      handleCloseModal();
    } catch (error) {
      setError('Failed to save media');
      console.error('Error saving media:', error);
    }
  };

  const handleEdit = (media) => {
    setSelectedMedia(media);
    setFormData({
      title: media.title || '',
      description: media.description || '',
      type: media.type || 'image',
      file: null
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this media?')) {
      try {
        await axios.delete(`${ENDPOINTS.MEDIA}/${id}`);
        fetchMedia();
      } catch (error) {
        setError('Failed to delete media');
        console.error('Error deleting media:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
    setFormData({
      title: '',
      description: '',
      type: 'image',
      file: null
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Media Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Add /> Add New Media
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {media.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="relative">
              {item.type === 'image' ? (
                <img
                  src={getImageUrl(item.path)}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="relative w-full h-48 mb-4">
                  <video
                    src={getImageUrl(item.path)}
                    className="w-full h-full object-cover rounded-lg"
                    controls
                  />
                  <PlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl" />
                </div>
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit />
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-600 hover:text-red-800"
              >
                <Delete />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {selectedMedia ? 'Edit Media' : 'Add New Media'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Media Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">File</label>
                <input
                  type="file"
                  accept={formData.type === 'video' ? 'video/*' : 'image/*'}
                  onChange={handleFileChange}
                  className="mt-1 block w-full"
                  required={!selectedMedia}
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {selectedMedia ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManager; 