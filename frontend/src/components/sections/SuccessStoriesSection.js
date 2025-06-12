import React, { useEffect, useState } from 'react';
import { Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { reviewService } from '../../services/api';
import { getImageUrl } from '../../config/constants';

const SuccessStoriesSection = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await reviewService.getReviews();
        setStories(response.data);
      } catch (error) {
        console.error('Error fetching success stories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <section className="mt-32 text-center">
      <h2 className="text-4xl md:text-5xl font-black text-pink-700 mb-4 tracking-tight">
        Success Stories
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-14">
        Read about the lives transformed by our prosthetics and support services
      </p>

      {/* Single row grid with horizontal scroll */}
      <div className="flex overflow-x-auto gap-8 md:gap-10 pb-4 mb-0 snap-x snap-mandatory">
        {stories.slice(0, 4).map((story) => (
          <div
            key={story._id}
            className="relative rounded-3xl shadow-2xl overflow-hidden flex-shrink-0 w-[300px] h-96 min-h-[380px] hover:shadow-pink-200/70 transition-shadow border border-pink-100 snap-center"
          >
            {story.imagePath && (
              <img
                src={getImageUrl(story.imagePath)}
                alt={story.name}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                draggable={false}
              />
            )}
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />
            <div className="relative z-20 flex flex-col justify-end h-full p-5 md:p-6 text-left">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{story.name}</h3>
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < story.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-white text-base leading-relaxed line-clamp-5 drop-shadow-md">
                  {story.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/success-stories', { state: { stories } })}
        className="mt-14 px-10 py-4 bg-gradient-to-r from-pink-500 to-blue-600 text-white rounded-full font-semibold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg"
      >
        View All Stories
      </button>
    </section>
  );
};

export { SuccessStoriesSection };