import React, { useState } from 'react';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import ImageUpload from './ImageUpload';
import api from '../../services/api';

const ImageUploadButton = ({
  itemId,
  itemType,
  onUploadSuccess,
  onUploadError,
  multiple = false,
  maxFiles = 5,
}) => {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleOpen = () => {
    setOpen(true);
    setFiles([]);
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setFiles([]);
    setError(null);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await api.post(`/api/${itemType}/${itemId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.images) {
        response.data.images.forEach(url => onUploadSuccess?.(url, itemId));
      }

      handleClose();
    } catch (err) {
      console.error('Error uploading images:', err);
      setError(err.response?.data?.message || 'Failed to upload images');
      onUploadError?.(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          color: 'primary.main',
          '&:hover': { bgcolor: 'primary.light' },
        }}
        title="Upload Images"
      >
        <PhotoCameraIcon />
      </IconButton>

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
            Upload Images
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <ImageUpload
              value={files}
              onChange={setFiles}
              multiple={multiple}
              maxFiles={maxFiles}
              label={multiple ? "Upload Images" : "Upload Image"}
              error={error}
              helperText={multiple ? 
                `Upload up to ${maxFiles} images` : 
                "Upload a single image"
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            color="primary"
            disabled={uploading || files.length === 0}
            sx={{
              fontWeight: 700,
              borderRadius: 8,
              textTransform: 'none',
              px: 4,
            }}
          >
            {uploading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImageUploadButton; 