'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Delete, Check, Close } from '@mui/icons-material';
import { Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import * as PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Image from 'next/image';
import { StyledCardDropzone } from './ui';

// Helper function to create image from blob
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

// Helper: crop is in displayed-pixel coords; scale to natural image coords for correct output
const getCroppedImg = async (imageSrc, crop, fileName, displayWidth, displayHeight) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  // Crop is in pixels of the displayed img (dialog). Scale to natural image dimensions.
  const scaleX = image.naturalWidth / (displayWidth || image.width);
  const scaleY = image.naturalHeight / (displayHeight || image.height);

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  const cropW = crop.width * scaleX;
  const cropH = crop.height * scaleY;

  canvas.width = Math.round(cropW);
  canvas.height = Math.round(cropH);
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(image, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        const file = new File([blob], fileName, { type: blob.type });
        resolve(file);
      },
      'image/jpeg',
      0.95
    );
  });
};

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
  aspectRatio = null, // e.g., 1 for 1:1, 4/3 for 4:3, null for free crop
  cropEnabled = true, // Enable/disable crop functionality
}) => {
  const [previews, setPreviews] = useState([]);
  const [removedPreviews, setRemovedPreviews] = useState([]);
  const [error, setError] = useState('');
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 90, aspect: aspectRatio });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const pendingFilesQueue = useRef([]);
  const processedFilesRef = useRef([]);

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;

    // Create a default crop immediately so "Apply Crop" works without dragging.
    if (aspectRatio) {
      const cropWidth = Math.min(width, height * aspectRatio);
      const cropHeight = cropWidth / aspectRatio;
      const cropX = (width - cropWidth) / 2;
      const cropY = (height - cropHeight) / 2;

      const nextCrop = {
        unit: 'px',
        x: cropX,
        y: cropY,
        width: cropWidth,
        height: cropHeight,
        aspect: aspectRatio,
      };

      setCrop(nextCrop);
      setCompletedCrop(nextCrop);
      return;
    }

    // Free crop: default to a centered 90% box.
    const cropWidth = width * 0.9;
    const cropHeight = height * 0.9;
    const cropX = (width - cropWidth) / 2;
    const cropY = (height - cropHeight) / 2;

    const nextCrop = {
      unit: 'px',
      x: cropX,
      y: cropY,
      width: cropWidth,
      height: cropHeight,
    };

    setCrop(nextCrop);
    setCompletedCrop(nextCrop);
  }, [aspectRatio]);

  const processNextFile = useCallback(() => {
    if (pendingFilesQueue.current.length > 0) {
      const nextFile = pendingFilesQueue.current.shift();
      setImageToCrop({
        file: nextFile.file,
        preview: nextFile.preview,
      });
      setCompletedCrop(null);
      setCrop({ unit: '%', width: 90, aspect: aspectRatio });
      setCropDialogOpen(true);
    } else {
      // All files processed
      setPreviews((prev) => {
        const updatedPreviews = [...prev, ...processedFilesRef.current];
        onChange(updatedPreviews.map((item) => item.file));
        return updatedPreviews;
      });
      processedFilesRef.current = [];
      setCropDialogOpen(false);
      setImageToCrop(null);
      setCompletedCrop(null);
    }
  }, [aspectRatio, onChange]);

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current || !imageToCrop) {
      return;
    }

    try {
      // Use displayed size of the img in the crop dialog (crop coords are in this space)
      const displayWidth = imgRef.current?.clientWidth ?? imgRef.current?.naturalWidth;
      const displayHeight = imgRef.current?.clientHeight ?? imgRef.current?.naturalHeight;
      const croppedFile = await getCroppedImg(
        imageToCrop.preview,
        completedCrop,
        imageToCrop.file.name,
        displayWidth,
        displayHeight
      );
      const croppedPreview = {
        file: croppedFile,
        preview: URL.createObjectURL(croppedFile),
      };

      if (multiple) {
        processedFilesRef.current.push(croppedPreview);
        processNextFile();
      } else {
        setPreviews([croppedPreview]);
        onChange(croppedFile);
        setCropDialogOpen(false);
        setImageToCrop(null);
        setCompletedCrop(null);
      }
    } catch (err) {
      console.error('Error cropping image:', err);
      setError('Failed to crop image. Please try again.');
    }
  };

  const handleCropCancel = () => {
    setCropDialogOpen(false);
    setImageToCrop(null);
    setCompletedCrop(null);
    pendingFilesQueue.current = [];
    processedFilesRef.current = [];
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

      setError('');

      if (cropEnabled) {
        // Reset any previous crop queue state
        pendingFilesQueue.current = [];
        processedFilesRef.current = [];
        setCompletedCrop(null);
        setCrop({ unit: '%', width: 90, aspect: aspectRatio });

        // Queue all files for cropping
        const filesWithPreviews = acceptedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));
        
        if (multiple && filesWithPreviews.length > 1) {
          // Multiple files: queue all except first
          pendingFilesQueue.current = filesWithPreviews.slice(1);
          // Show crop dialog for first file
          setImageToCrop(filesWithPreviews[0]);
        } else {
          // Single file
          setImageToCrop(filesWithPreviews[0]);
        }
        setCropDialogOpen(true);
      } else {
        // No crop, process files directly
        const newPreviews = acceptedFiles.map((file) => ({
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
          onChange(acceptedFiles[0]);
        }
      }
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

  // Sync previews with initialImages only when there is no locally selected file yet.
  useEffect(() => {
    if (!initialImages) return;

    setPreviews((prev) => {
      const hasLocalFile = prev.some((item) => !!item.file);

      // If the user has already selected/cropped an image in this session,
      // don't override it with initialImages from props.
      if (hasLocalFile) {
        return prev;
      }

      const imagesArray = Array.isArray(initialImages)
        ? initialImages
        : initialImages
          ? [initialImages]
          : [];

      if (imagesArray.length === 0) {
        return [];
      }

      return imagesArray.map((image) => ({
        file: null,
        preview: image,
      }));
    });
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
          Only jpeg, jpg, png files are allowed.
          {cropEnabled && aspectRatio && ` Crop ratio: ${aspectRatio === 1 ? '1:1' : aspectRatio === 4/3 ? '4:3' : aspectRatio === 16/9 ? '16:9' : aspectRatio}`}
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
                width={300}
                height={300}
                style={{
                  width: '100%',
                  height: 'auto',
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

      {/* Crop Dialog */}
      <Dialog
        open={cropDialogOpen}
        onClose={handleCropCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Crop Image</Typography>
            <IconButton onClick={handleCropCancel}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {imageToCrop && (
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatio}
                minWidth={50}
                minHeight={50}
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imageToCrop.preview}
                  style={{ maxWidth: '100%', maxHeight: '70vh' }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCropCancel} startIcon={<Close />}>
            Cancel
          </Button>
          <Button
            onClick={handleCropComplete}
            variant="contained"
            startIcon={<Check />}
            disabled={!completedCrop}
          >
            Apply Crop
          </Button>
        </DialogActions>
      </Dialog>
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
  aspectRatio: PropTypes.number, // e.g., 1 for 1:1, 4/3 for 4:3, null for free crop
  cropEnabled: PropTypes.bool, // Enable/disable crop functionality
};
