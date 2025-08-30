'use client';

import { useState, useEffect } from 'react';
import { Upload, Delete } from '@mui/icons-material';
import { Box, Typography, IconButton } from '@mui/material';
import * as PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image'; // Using Next.js image optimization
import { StyledCardDropzone } from './ui';

const MIN_WIDTH = 800;
const MIN_HEIGHT = 600;
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1200;

const UIFileUploader = ({
  accept = 'image/png, image/jpeg',
  multiple = false,
  onChange = () => {},
  title = 'Upload Images',
  label = '',
  initialImages = [],
  onDel = () => {},
  errorMessage = '',
  showDelBtn = false,
  heightMin = '',
  heightMax = '',
}) => {
  const [previews, setPreviews] = useState([]);
  const [removedPreviews, setRemovedPreviews] = useState([]);
  const [error, setError] = useState('');

  // ✅ Check minimum image dimensions
  const checkDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const { width, height } = img;
        const minHeight = heightMin !== '' ? Number(heightMin) : MIN_HEIGHT;
        const maxHeight = heightMax !== '' ? Number(heightMax) : MAX_HEIGHT;

        if (width < MIN_WIDTH || height < minHeight) {
          reject(
            new Error(
              `Image too small: ${width}x${height}. Minimum required is ${MIN_WIDTH}x${minHeight}.`
            )
          );
        } else if (width > MAX_WIDTH || height > maxHeight) {
          reject(
            new Error(
              `Image too large: ${width}x${height}. Maximum allowed is ${MAX_WIDTH}x${maxHeight}.`
            )
          );
        } else {
          resolve(file);
        }
      };

      img.onerror = () => reject(new Error('Invalid image file.'));
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple,
    onDrop: (acceptedFiles) => {
      const invalidTypeFiles = acceptedFiles.filter(
        (file) => file.type !== 'image/jpeg' && file.type !== 'image/png'
      );
      if (invalidTypeFiles.length > 0) {
        setError('Only jpeg and png files are allowed.');
        return;
      }

      Promise.allSettled(acceptedFiles.map(checkDimensions)).then((results) => {
        const validFiles = results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
        const errors = results.filter((r) => r.status === 'rejected').map((r) => r.reason.message);

        if (errors.length > 0) {
          setError(errors.join(' '));
          return;
        } else {
          setError('');
        }

        const newPreviews = validFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));

        if (multiple) {
          setPreviews((prev) => {
            const updatedPreviews = [...prev, ...newPreviews];
            onChange(updatedPreviews.map((item) => item.file));
            return updatedPreviews;
          });
        } else {
          setPreviews(newPreviews);
          onChange(validFiles[0]);
        }
      });
    },
  });

  const handleRemoveImage = (index) => {
    const previewToRemove = previews[index];
    const result = onDel(index);

    if (result) {
      setPreviews((prev) => {
        const updatedPreviews = prev.filter((_, i) => i !== index);
        onChange(updatedPreviews.map((item) => item.file));
        return updatedPreviews;
      });

      if (previewToRemove && previewToRemove.preview) {
        setRemovedPreviews((prevRemoved) => [...prevRemoved, previewToRemove.preview]);
      }
    }
  };

  useEffect(() => {
    if (initialImages?.length > 0) {
      const initialPreviews = initialImages.map((image) => ({
        file: null,
        preview: image,
      }));
      setPreviews(initialPreviews);
    }
  }, [initialImages]);

  useEffect(() => {
    removedPreviews.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    if (removedPreviews.length > 0) {
      setRemovedPreviews([]);
    }
  }, [removedPreviews]);

  return (
    <Box my="0.5rem">
      <Typography fontWeight="800" variant="h5">
        {label}
      </Typography>
      <input type="file" multiple={multiple} hidden {...getInputProps()} />
      <StyledCardDropzone
        sx={(theme) => ({
          ...((errorMessage || error) && {
            border: `1px solid ${theme.palette.error.main}`,
            '&:hover': {
              border: `1px solid ${theme.palette.error.main}`,
            },
          }),
        })}
        isDragActive={isDragActive}
        {...getRootProps()}
      >
        <Upload />
        <Typography fontWeight={700}>{title}</Typography>
        <Typography color="text.main" variant="caption">
          Only jpeg, jpg, png — Min size: {MIN_WIDTH}x
          {heightMin !== '' ? Number(heightMin) : MIN_HEIGHT}px
          {heightMax !== '' && ` — Max size: ${MAX_WIDTH}x${Number(heightMax)}px`}
        </Typography>
      </StyledCardDropzone>
      <Typography color="error" variant="caption">
        {error || errorMessage}
      </Typography>

      {previews.length > 0 && (
        <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
          {previews.map((filePreview, index) => (
            <Box
              key={index}
              display="flex"
              flexDirection="column"
              alignItems="center"
              position="relative"
            >
              <Image
                src={filePreview?.preview || filePreview}
                alt={`Preview ${index}`}
                width={100}
                height={100}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                }}
                priority
              />
              {showDelBtn && previews.length > 1 && (
                <IconButton
                  size="small"
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    background: 'rgba(0,0,0,0.5)',
                  }}
                  onClick={() => handleRemoveImage(index)}
                >
                  <Delete style={{ color: '#fff' }} />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UIFileUploader;

UIFileUploader.propTypes = {
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  onDel: PropTypes.func,
  label: PropTypes.string,
  initialImages: PropTypes.array,
  errorMessage: PropTypes.string,
  showDelBtn: PropTypes.bool,
};
