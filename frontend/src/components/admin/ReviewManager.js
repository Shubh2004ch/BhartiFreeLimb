import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ENDPOINTS, getImageUrl } from '../../constants';
import { Delete, Edit, Add, Star } from '@mui/icons-material';
import api from '../../services/api';

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    text: '',
    rating: '',
    image: null
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(ENDPOINTS.REVIEWS);
      setReviews(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch reviews');
      console.error('Error fetching reviews:', error);
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
      image: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.text || !formData.rating) {
      alert('Please fill all required fields!');
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (selectedReview) {
        await axios.put(`${ENDPOINTS.REVIEWS}/${selectedReview._id}`, formDataToSend);
      } else {
        await axios.post(ENDPOINTS.REVIEWS, formDataToSend);
      }

      fetchReviews();
      handleCloseModal();
    } catch (error) {
      setError('Failed to save review');
      console.error('Error saving review:', error);
    }
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    setFormData({
      name: review.name || '',
      text: review.text || '',
      rating: review.rating || '',
      image: null
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`${ENDPOINTS.REVIEWS}/${id}`);
        fetchReviews();
      } catch (error) {
        setError('Failed to delete review');
        console.error('Error deleting review:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
    setFormData({
      name: '',
      text: '',
      rating: '',
      image: null
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Add /> Add New Review
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{review.name}</h3>
            <p className="text-gray-600 mb-4">{review.text}</p>
            {review.imagePath && (
              <img
                src={getImageUrl(review.imagePath)}
                alt={review.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleEdit(review)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit />
              </button>
              <button
                onClick={() => handleDelete(review._id)}
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
              {selectedReview ? 'Edit Review' : 'Add New Review'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Review Text</label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  min="1"
                  max="5"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full"
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
                  {selectedReview ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManager; 