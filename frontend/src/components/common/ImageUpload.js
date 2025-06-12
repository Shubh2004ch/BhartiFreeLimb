import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { getImageUrl } from '../../constants';

const ImageUpload = ({
  value,
  onChange,
  multiple = false,
  maxFiles = 5,
  accept = 'image/*',
  label = 'Upload Image',
  error,
  helperText,
  previewHeight = 200,
  previewWidth = '100%',
  showPreview = true,
  disabled = false,
}) => {
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    
    if (multiple) {
      if (files.length + previewUrls.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} images`);
        return;
      }
      
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
      onChange([...value, ...files]);
    } else {
      if (files.length > 0) {
        const file = files[0];
        setPreviewUrls([URL.createObjectURL(file)]);
        onChange(file);
      }
    }
  };

  const removeImage = (index) => {
    if (multiple) {
      const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
      const newFiles = value.filter((_, i) => i !== index);
      setPreviewUrls(newPreviewUrls);
      onChange(newFiles);
    } else {
      setPreviewUrls([]);
      onChange(null);
    }
  };

  const renderPreview = () => {
    if (!showPreview) return null;

    const images = multiple ? value : [value];
    const urls = multiple ? previewUrls : [previewUrls[0]];

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
        {urls.map((url, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              width: previewWidth,
              height: previewHeight,
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <IconButton
              onClick={() => removeImage(index)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)',
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box>
      <input
        accept={accept}
        type="file"
        id="image-upload"
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />
      <label htmlFor="image-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
          disabled={disabled || uploading}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            borderColor: 'primary.light',
          }}
        >
          {uploading ? (
            <CircularProgress size={24} sx={{ mr: 1 }} />
          ) : (
            label
          )}
        </Button>
      </label>
      {error && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
      {helperText && !error && (
        <Typography color="text.secondary" variant="caption" sx={{ mt: 1, display: 'block' }}>
          {helperText}
        </Typography>
      )}
      {renderPreview()}
    </Box>
  );
};

export default ImageUpload; 