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
  LocationOn,
  LocalPhone,
  Info,
  Opacity,
  WaterDrop,
} from '@mui/icons-material';
import { ENDPOINTS, getImageUrl } from '../../constants';
import api from '../../services/api';

const WaterPondForm = () => {
  const [waterPonds, setWaterPonds] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingPond, setEditingPond] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contactNumber: '',
    image: null,
  });

  useEffect(() => {
    fetchWaterPonds();
  }, []);

  const fetchWaterPonds = async () => {
    setLoading(true);
    try {
      const response = await api.get(ENDPOINTS.WATER_PONDS);
      setWaterPonds(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching water ponds:', error);
      setError('Failed to fetch water ponds');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (pond = null) => {
    if (pond) {
      setEditingPond(pond);
      setFormData({
        name: pond.name || '',
        location: pond.location || '',
        contactNumber: pond.contactNumber || '',
        image: null,
      });
    } else {
      setEditingPond(null);
      setFormData({
        name: '',
        location: '',
        contactNumber: '',
        image: null,
      });
    }
    setOpen(true);
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPond(null);
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
      if (editingPond) {
        await api.put(`${ENDPOINTS.WATER_PONDS}/${editingPond._id}`, formDataToSend);
        setSuccess('Water pond updated successfully');
      } else {
        await api.post(ENDPOINTS.WATER_PONDS, formDataToSend);
        setSuccess('Water pond added successfully');
      }
      fetchWaterPonds();
      handleClose();
    } catch (error) {
      console.error('Error saving water pond:', error);
      setError(error.response?.data?.message || 'Failed to save water pond');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this water pond?')) {
      try {
        await api.delete(`${ENDPOINTS.WATER_PONDS}/${id}`);
        setSuccess('Water pond deleted successfully');
        fetchWaterPonds();
      } catch (error) {
        console.error('Error deleting water pond:', error);
        setError('Failed to delete water pond');
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
          <WaterDrop sx={{ fontSize: 44, color: 'primary.main', mr: 1 }} />
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
            Manage Water Ponds
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
          Add New Water Pond
        </Button>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Grid container spacing={5}>
          {waterPonds.map((pond, idx) => (
            <Grid item xs={12} sm={6} md={4} key={pond._id}>
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
                  {pond.imagePath && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={getImageUrl(pond.imagePath)}
                      alt={pond.name}
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
                      <WaterDrop sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
                      {pond.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <LocationOn sx={{ color: '#f472b6', fontSize: 20, mr: 1 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {pond.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <LocalPhone sx={{ color: 'success.main', fontSize: 18, mr: 1 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {pond.contactNumber}
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
                          onClick={() => handleOpen(pond)}
                          color="primary"
                          sx={{ bgcolor: '#f1f7ff', mr: 0.5 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <IconButton
                          onClick={() => handleDelete(pond._id)}
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
              {editingPond ? 'Edit Water Pond' : 'Add New Water Pond'}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} id="water-pond-form">
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
                label="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Contact Number"
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
                margin="normal"
                required
              />
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
                {editingPond && editingPond.imagePath && (
                  <Box mt={2} textAlign="center">
                    <img
                      src={getImageUrl(editingPond.imagePath)}
                      alt={editingPond.name}
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
              form="water-pond-form"
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
              {editingPond ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default WaterPondForm;