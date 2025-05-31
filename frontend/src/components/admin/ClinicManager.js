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
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  LocalHospital,
  AddCircleOutline,
  LocationOn,
  LocalPhone,
  AccessTime,
  Info,
  Healing,
} from '@mui/icons-material';
import { ENDPOINTS, getImageUrl } from '../../constants';
import api from '../../services/api';

const ClinicManager = () => {
  const [clinics, setClinics] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    contactNumber: '',
    operatingHours: '',
    services: '',
    image: null,
  });

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    setLoading(true);
    try {
      const response = await api.get(ENDPOINTS.CLINICS);
      setClinics(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching clinics:', error);
      setError('Failed to fetch clinics');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (clinic = null) => {
    if (clinic) {
      setEditingClinic(clinic);
      setFormData({
        name: clinic.name,
        location: clinic.location,
        description: clinic.description,
        contactNumber: clinic.contactNumber,
        operatingHours: clinic.operatingHours,
        services: clinic.services ? clinic.services.join(', ') : '',
        image: null,
      });
    } else {
      setEditingClinic(null);
      setFormData({
        name: '',
        location: '',
        description: '',
        contactNumber: '',
        operatingHours: '',
        services: '',
        image: null,
      });
    }
    setOpen(true);
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    setOpen(false);
    setEditingClinic(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach((key) => {
      if (key === 'services') {
        const servicesArray = formData[key]
          .split(',')
          .map(service => service.trim())
          .filter(service => service);
        formDataToSend.append(key, JSON.stringify(servicesArray));
      } else if (formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      if (editingClinic) {
        await api.put(`${ENDPOINTS.CLINICS}/${editingClinic._id}`, formDataToSend);
        setSuccess('Clinic updated successfully');
      } else {
        await api.post(ENDPOINTS.CLINICS, formDataToSend);
        setSuccess('Clinic added successfully');
      }
      fetchClinics();
      handleClose();
    } catch (error) {
      console.error('Error saving clinic:', error);
      setError(error.response?.data?.message || 'Failed to save clinic');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this clinic?')) {
      try {
        await api.delete(`${ENDPOINTS.CLINICS}/${id}`);
        setSuccess('Clinic deleted successfully');
        fetchClinics();
      } catch (error) {
        console.error('Error deleting clinic:', error);
        setError('Failed to delete clinic');
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
          <LocalHospital sx={{ fontSize: 44, color: 'primary.main', mr: 1 }} />
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
            Manage Clinics & Shelters
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
          Add New Clinic
        </Button>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Grid container spacing={5}>
            {clinics.map((clinic, idx) => (
            <Grid item xs={12} sm={6} md={4} key={clinic._id}>
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
                    {clinic.imagePath && (
                      <CardMedia
                        component="img"
                        height="200"
                      image={getImageUrl(clinic.imagePath)}
                        alt={clinic.name}
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
                        <LocalHospital sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
                        {clinic.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <LocationOn sx={{ color: '#f472b6', fontSize: 20, mr: 1 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {clinic.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <LocalPhone sx={{ color: 'success.main', fontSize: 18, mr: 1 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {clinic.contactNumber}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <AccessTime sx={{ color: '#38bdf8', fontSize: 18, mr: 1 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {clinic.operatingHours}
                        </Typography>
                      </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                        <Info sx={{ color: '#2563eb', fontSize: 18, mr: 1 }} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontWeight: 500,
                            fontStyle: 'italic',
                          }}
                        >
                          {clinic.description}
                        </Typography>
                      </Box>
                    {clinic.services && clinic.services.length > 0 && (
                      <Box sx={{ mt: 1.2, mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.7 }}>
                        {clinic.services.map((service, index) => (
                          <Tooltip key={index} title={service} arrow>
                            <Box
                              sx={{
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 2,
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                letterSpacing: 0.3,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              <Healing sx={{ fontSize: 16 }} />
                              {service}
                            </Box>
                          </Tooltip>
                          ))}
                      </Box>
                    )}
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
                            onClick={() => handleOpen(clinic)}
                            color="primary"
                            sx={{ bgcolor: '#f1f7ff', mr: 0.5 }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                          <IconButton
                            onClick={() => handleDelete(clinic._id)}
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
              {editingClinic ? 'Edit Clinic' : 'Add New Clinic'}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} id="clinic-form">
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
                label="Contact Number"
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Operating Hours"
                value={formData.operatingHours}
                onChange={(e) =>
                  setFormData({ ...formData, operatingHours: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Services (comma-separated)"
                value={formData.services}
                onChange={(e) =>
                  setFormData({ ...formData, services: e.target.value })
                }
                margin="normal"
                helperText="Enter services separated by commas"
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
                {editingClinic && editingClinic.imagePath && (
                  <Box mt={2} textAlign="center">
                    <img
                      src={getImageUrl(editingClinic.imagePath)}
                      alt={editingClinic.name}
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
              form="clinic-form"
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
              {editingClinic ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ClinicManager;