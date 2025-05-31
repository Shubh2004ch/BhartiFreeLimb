import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Box,
  Tooltip,
  Fade,
  Alert,
  Rating,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  AddCircleOutline,
  Star,
  Person,
  Comment,
} from '@mui/icons-material';
import { ENDPOINTS, getImageUrl } from '../../constants';
import api from '../../services/api';

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    text: '',
    rating: 5,
    image: null,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await api.get(ENDPOINTS.REVIEWS);
      setReviews(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (review = null) => {
    if (review) {
      setEditingReview(review);
      setFormData({
        name: review.name || '',
        text: review.text || '',
        rating: review.rating || 5,
        image: null,
      });
    } else {
      setEditingReview(null);
      setFormData({
        name: '',
        text: '',
        rating: 5,
        image: null,
      });
    }
    setOpen(true);
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    setOpen(false);
    setEditingReview(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

    try {
      if (editingReview) {
        await api.put(`${ENDPOINTS.REVIEWS}/${editingReview._id}`, formDataToSend);
        setSuccess('Review updated successfully');
      } else {
        await api.post(ENDPOINTS.REVIEWS, formDataToSend);
        setSuccess('Review added successfully');
      }
      fetchReviews();
      handleClose();
    } catch (error) {
      console.error('Error saving review:', error);
      setError(error.response?.data?.message || 'Failed to save review');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`${ENDPOINTS.REVIEWS}/${id}`);
        setSuccess('Review deleted successfully');
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
        setError('Failed to delete review');
      }
    }
  };

  return (
    <Box
      sx={{
        bgcolor: 'linear-gradient(120deg,#f0f9ff 0%,#fff7f7 100%)',
        background: 'linear-gradient(120deg,#e0ecff 0%,#fff6f6 100%)',
        minHeight: '100vh',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 4,
            gap: 2,
            justifyContent: { xs: 'center', md: 'flex-start' },
          }}
        >
          <Star sx={{ fontSize: 44, color: 'primary.main', mr: 1 }} />
          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              background: 'linear-gradient(90deg, #2563eb 30%, #f472b6 70%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              letterSpacing: 1.2,
            }}
          >
            Manage Reviews
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutline />}
          onClick={() => handleOpen()}
          sx={{
            mb: 5,
            borderRadius: 99,
            fontWeight: 700,
            px: 4,
            fontSize: '1rem',
            boxShadow: 3,
            textTransform: 'none',
            letterSpacing: 0.5,
          }}
        >
          Add New Review
        </Button>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Grid container spacing={5}>
          {reviews.map((review, idx) => (
            <Grid item xs={12} sm={6} md={4} key={review._id}>
              <Fade in timeout={500} style={{ transitionDelay: `${idx * 80}ms` }}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow:
                      '0 6px 22px 0 rgba(59,130,246,0.09), 0 2px 8px 0 rgba(236,72,153,0.09)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    transition:
                      'transform 0.22s cubic-bezier(.4,0,.2,1), box-shadow 0.22s cubic-bezier(.4,0,.2,1)',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.03)',
                      boxShadow:
                        '0 12px 36px 0 rgba(59,130,246,0.18), 0 3px 12px 0 rgba(236,72,153,0.16)',
                    },
                    bgcolor: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(3px)',
                  }}
                >
            {review.imagePath && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={getImageUrl(review.imagePath)}
                alt={review.name}
                      sx={{
                        objectFit: 'cover',
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                      }}
                    />
                  )}
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      p: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={review.rating} readOnly precision={0.5} />
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        color: 'primary.main',
                        fontSize: '1.16rem',
                        letterSpacing: 0.1,
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Person sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
                      {review.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                      <Comment sx={{ color: '#f472b6', fontSize: 20, mr: 1, mt: 0.5 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontWeight: 500,
                          fontStyle: 'italic',
                          lineHeight: 1.5,
                        }}
                      >
                        {review.text}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 1,
                      }}
                    >
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          onClick={() => handleOpen(review)}
                          color="primary"
                          sx={{ bgcolor: '#f1f7ff', mr: 0.5 }}
              >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <IconButton
                onClick={() => handleDelete(review._id)}
                          color="error"
                          sx={{ bgcolor: '#fff5f5' }}
              >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
        ))}
        </Grid>

        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 4, p: 1 },
          }}
        >
          <DialogTitle>
            <Typography variant="h5" color="primary" fontWeight={700}>
              {editingReview ? 'Edit Review' : 'Add New Review'}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} id="review-form">
              <TextField
                fullWidth
                label="Name"
                  value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                margin="normal"
                  required
                />
              <TextField
                fullWidth
                label="Review Text"
                  value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                margin="normal"
                  required
                multiline
                rows={4}
                />
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography component="legend">Rating</Typography>
                <Rating
                  name="rating"
                  value={formData.rating}
                  onChange={(event, newValue) =>
                    setFormData({ ...formData, rating: newValue })
                  }
                  precision={0.5}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    borderColor: 'primary.light',
                  }}
                >
                  Upload Image
                <input
                  type="file"
                  accept="image/*"
                    hidden
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                />
                </Button>
                {editingReview && editingReview.imagePath && (
                  <Box mt={2} textAlign="center">
                    <img
                      src={getImageUrl(editingReview.imagePath)}
                      alt={editingReview.name}
                      style={{
                        maxWidth: 120,
                        maxHeight: 120,
                        borderRadius: 12,
                        boxShadow: '0 2px 12px rgba(59,130,246,0.10)',
                        margin: 'auto',
                      }}
                    />
                  </Box>
                )}
              </Box>
            </form>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              form="review-form"
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                fontWeight: 700,
                borderRadius: 8,
                textTransform: 'none',
                px: 4,
              }}
            >
              {editingReview ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ReviewManager; 