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
  MenuItem,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  AddCircleOutline,
  PlayCircle,
  Image as ImageIcon,
  Movie,
  Info,
} from '@mui/icons-material';
import { ENDPOINTS, getImageUrl } from '../../constants';
import api from '../../services/api';

const MediaManager = () => {
  const [media, setMedia] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'image',
    file: null,
  });

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const response = await api.get(ENDPOINTS.MEDIA);
      setMedia(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching media:', error);
      setError('Failed to fetch media');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (item = null) => {
    if (item) {
      setEditingMedia(item);
      setFormData({
        title: item.title || '',
        description: item.description || '',
        type: item.type || 'image',
        file: null,
      });
    } else {
      setEditingMedia(null);
      setFormData({
        title: '',
        description: '',
        type: 'image',
        file: null,
      });
    }
    setOpen(true);
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMedia(null);
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
      if (editingMedia) {
        await api.put(`${ENDPOINTS.MEDIA}/${editingMedia._id}`, formDataToSend);
        setSuccess('Media updated successfully');
      } else {
        await api.post(ENDPOINTS.MEDIA, formDataToSend);
        setSuccess('Media added successfully');
      }
      fetchMedia();
      handleClose();
    } catch (error) {
      console.error('Error saving media:', error);
      setError(error.response?.data?.message || 'Failed to save media');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this media?')) {
      try {
        await api.delete(`${ENDPOINTS.MEDIA}/${id}`);
        setSuccess('Media deleted successfully');
        fetchMedia();
      } catch (error) {
        console.error('Error deleting media:', error);
        setError('Failed to delete media');
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
          <ImageIcon sx={{ fontSize: 44, color: 'primary.main', mr: 1 }} />
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
            Manage Media
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
          Add New Media
        </Button>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Grid container spacing={5}>
          {media.map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
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
                  <Box sx={{ position: 'relative' }}>
              {item.type === 'image' ? (
                      <CardMedia
                        component="img"
                        height="200"
                        image={getImageUrl(item.path)}
                  alt={item.title}
                        sx={{
                          objectFit: 'cover',
                          borderTopLeftRadius: 16,
                          borderTopRightRadius: 16,
                        }}
                />
              ) : (
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="video"
                          height="200"
                          image={getImageUrl(item.path)}
                          sx={{
                            objectFit: 'cover',
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                          }}
                    controls
                  />
                        <PlayCircle
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: 'white',
                            fontSize: 48,
                            opacity: 0.9,
                            pointerEvents: 'none',
                          }}
                        />
                      </Box>
              )}
                  </Box>
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      p: 3,
                    }}
                  >
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
                      {item.type === 'image' ? (
                        <ImageIcon sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
                      ) : (
                        <Movie sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
                      )}
                      {item.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                      <Info sx={{ color: '#f472b6', fontSize: 20, mr: 1, mt: 0.5 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontWeight: 500,
                          fontStyle: 'italic',
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description}
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
                          onClick={() => handleOpen(item)}
                          color="primary"
                          sx={{ bgcolor: '#f1f7ff', mr: 0.5 }}
              >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <IconButton
                onClick={() => handleDelete(item._id)}
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
              {editingMedia ? 'Edit Media' : 'Add New Media'}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} id="media-form">
              <TextField
                fullWidth
                label="Title"
                  value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                margin="normal"
                  required
                />
              <TextField
                fullWidth
                label="Description"
                  value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                margin="normal"
                required
                multiline
                rows={4}
                />
              <TextField
                fullWidth
                select
                label="Media Type"
                  value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                margin="normal"
                required
                >
                <MenuItem value="image">Image</MenuItem>
                <MenuItem value="video">Video</MenuItem>
              </TextField>
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
                  Upload File
                <input
                  type="file"
                  accept={formData.type === 'video' ? 'video/*' : 'image/*'}
                    hidden
                    onChange={(e) =>
                      setFormData({ ...formData, file: e.target.files[0] })
                    }
                />
                </Button>
                {editingMedia && editingMedia.path && (
                  <Box mt={2} textAlign="center">
                    {editingMedia.type === 'image' ? (
                      <img
                        src={getImageUrl(editingMedia.path)}
                        alt={editingMedia.title}
                        style={{
                          maxWidth: 120,
                          maxHeight: 120,
                          borderRadius: 12,
                          boxShadow: '0 2px 12px rgba(59,130,246,0.10)',
                          margin: 'auto',
                        }}
                      />
                    ) : (
                      <video
                        src={getImageUrl(editingMedia.path)}
                        style={{
                          maxWidth: 120,
                          maxHeight: 120,
                          borderRadius: 12,
                          boxShadow: '0 2px 12px rgba(59,130,246,0.10)',
                          margin: 'auto',
                        }}
                        controls
                      />
                    )}
                  </Box>
                )}
              </Box>
            </form>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              form="media-form"
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
              {editingMedia ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MediaManager; 