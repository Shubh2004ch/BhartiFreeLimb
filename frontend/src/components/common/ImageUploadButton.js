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
  LinearProgress,
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
  const [retryCount, setRetryCount] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const maxRetries = 3;

  const handleOpen = () => {
    setOpen(true);
    setFiles([]);
    setError(null);
    setUploadProgress(0);
  };

  const handleClose = () => {
    setOpen(false);
    setFiles([]);
    setError(null);
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one image');
      return;
    }

    // Validate file sizes before upload
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    const oversizedFiles = files.filter(file => file.size > maxFileSize);
    
    if (oversizedFiles.length > 0) {
      setError(`Files too large: ${oversizedFiles.map(f => f.name).join(', ')}. Maximum size is 50MB per file.`);
      return;
    }

    setUploading(true);
    setError(null);

    // Retry logic for failed uploads
    const attemptUpload = async (attempt = 1) => {
      try {
        const formData = new FormData();
        
        // Debug logging
        console.log(`=== Frontend Upload Debug (Attempt ${attempt}) ===`);
        console.log('Files to upload:', files);
        console.log('Item type:', itemType);
        console.log('Item ID:', itemId);
        
        files.forEach((file, index) => {
          console.log(`Appending file ${index + 1}:`, {
            name: file.name,
            type: file.type,
            size: file.size
          });
          formData.append('images', file);
        });

        // Log FormData contents
        console.log('FormData entries:');
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value instanceof File ? {
            name: value.name,
            type: value.type,
            size: value.size
          } : value);
        }

        // Validate FormData before sending
        const formDataEntries = Array.from(formData.entries());
        const imageEntries = formDataEntries.filter(([key]) => key === 'images');
        
        if (imageEntries.length === 0) {
          throw new Error('No images found in FormData. This should not happen.');
        }
        
        console.log(`FormData validation: ${imageEntries.length} image(s) ready for upload`);

        const response = await api.post(`/api/${itemType}/${itemId}/images`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 300000, // 5 minute timeout specifically for this upload
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${percentCompleted}%`);
            setUploadProgress(percentCompleted);
          },
        });

        if (response.data.images) {
          response.data.images.forEach(url => onUploadSuccess?.(url, itemId));
        }

        handleClose();
        return response;
      } catch (err) {
        console.error(`Upload attempt ${attempt} failed:`, err);
        
        // Retry logic for network errors and timeouts
        if (attempt < maxRetries && (
          err.code === 'ECONNABORTED' || 
          err.message.includes('timeout') || 
          err.message.includes('network') ||
          !err.response
        )) {
          console.log(`Retrying upload (attempt ${attempt + 1}/${maxRetries})...`);
          setError(`Upload attempt ${attempt} failed. Retrying...`);
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt)); // Exponential backoff
          return attemptUpload(attempt + 1);
        }
        
        throw err;
      }
    };

    try {
      await attemptUpload();
    } catch (err) {
      console.error('Error uploading images:', err);
      console.error('Error response:', err.response?.data);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to upload images';
      
      // Handle canceled requests specifically
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        errorMessage = 'Upload timed out. Please try again with smaller files or check your internet connection.';
      } else if (err.message.includes('canceled') || err.message.includes('aborted')) {
        errorMessage = 'Upload was canceled. Please try again.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Handle specific error cases
      if (err.response?.status === 400) {
        if (err.response.data?.expectedField && err.response.data?.receivedField) {
          errorMessage = `Field name error: Expected "${err.response.data.expectedField}" but received "${err.response.data.receivedField}". Please try again.`;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.response?.status === 413) {
        errorMessage = 'Files are too large. Please select smaller images.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (!err.response) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setError(errorMessage);
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
            
            {/* Upload Progress */}
            {uploading && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Uploading... {uploadProgress}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            )}
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