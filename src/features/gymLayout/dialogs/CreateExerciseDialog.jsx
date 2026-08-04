import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import CollectionsIcon from '@mui/icons-material/Collections';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  EXERCISE_CATEGORIES,
  createGymExerciseModel,
  getGymExerciseCategoryColor,
} from '../models/gymLayoutModels';

const MAX_IMAGE_SIZE = 640;
const IMAGE_QUALITY = 0.78;

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const resizeImageFile = async (file) => {
  const source = await readFileAsDataUrl(file);
  const image = await loadImage(source);
  const scale = Math.min(1, MAX_IMAGE_SIZE / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', IMAGE_QUALITY);
};

function CreateExerciseDialog({ open, onClose, onSubmit, saving = false, exercise = null, exercises = [] }) {
  const fileInputRef = useRef(null);
  const [imageError, setImageError] = useState('');
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: createGymExerciseModel(),
  });
  const selectedCategory = useWatch({ control, name: 'category' });
  const selectedImage = useWatch({ control, name: 'imageDataUrl' });
  const selectedImageName = useWatch({ control, name: 'imageName' });
  const selectedColor = getGymExerciseCategoryColor(selectedCategory);
  const importedImages = useMemo(() => {
    const seenImages = new Set();

    return exercises
      .filter((item) => item?.imageDataUrl)
      .filter((item) => {
        if (seenImages.has(item.imageDataUrl)) return false;
        seenImages.add(item.imageDataUrl);
        return true;
      })
      .map((item) => ({
        id: item.id,
        imageDataUrl: item.imageDataUrl,
        imageName: item.imageName || item.name || 'Imagen importada',
        exerciseName: item.name || 'Estación',
      }));
  }, [exercises]);

  useEffect(() => {
    reset(createGymExerciseModel(exercise || {}));
    setImageError('');
  }, [exercise, open, reset]);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Selecciona un archivo de imagen válido.');
      return;
    }

    try {
      setImageError('');
      const imageDataUrl = await resizeImageFile(file);
      setValue('imageDataUrl', imageDataUrl, { shouldDirty: true, shouldValidate: true });
      setValue('imageName', file.name, { shouldDirty: true, shouldValidate: true });
    } catch (error) {
      console.error('Error importing station image:', error);
      setImageError('No se pudo importar la imagen.');
    }
  };

  const clearImage = () => {
    setValue('imageDataUrl', '', { shouldDirty: true, shouldValidate: true });
    setValue('imageName', '', { shouldDirty: true, shouldValidate: true });
    setImageError('');
  };

  const selectImportedImage = (image) => {
    setValue('imageDataUrl', image.imageDataUrl, { shouldDirty: true, shouldValidate: true });
    setValue('imageName', image.imageName, { shouldDirty: true, shouldValidate: true });
    setImageError('');
  };

  const submit = async (values) => {
    await onSubmit({
      ...values,
      width: Number(values.width || 1),
      height: Number(values.height || 1),
      color: getGymExerciseCategoryColor(values.category),
    });
    reset(createGymExerciseModel());
    onClose();
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>{exercise ? 'Editar ejercicio' : 'Crear ejercicio'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 0.5 }}>
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'El nombre es obligatorio.' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre"
                  autoFocus
                  fullWidth
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              rules={{ required: 'La descripción es obligatoria.' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descripción"
                  minRows={3}
                  multiline
                  fullWidth
                  error={Boolean(errors.description)}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="category"
              control={control}
              rules={{ required: 'La categoría es obligatoria.' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Categoría"
                  fullWidth
                  error={Boolean(errors.category)}
                  helperText={errors.category?.message}
                >
                  {EXERCISE_CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ height: '100%', minHeight: 56, display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: selectedColor,
                  border: '2px solid',
                  borderColor: 'divider',
                  flexShrink: 0,
                }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Color automático
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {selectedCategory}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                border: '1px solid',
                borderColor: imageError ? 'error.main' : 'divider',
                borderRadius: 1,
                p: 1.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  alignItems: { xs: 'stretch', sm: 'center' },
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Box
                  sx={{
                    width: { xs: '100%', sm: 116 },
                    height: 86,
                    borderRadius: 1,
                    overflow: 'hidden',
                    bgcolor: 'action.hover',
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  {selectedImage ? (
                    <Box
                      component="img"
                      src={selectedImage}
                      alt={selectedImageName || 'Imagen de estación'}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <ImageIcon color="disabled" />
                  )}
                </Box>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={800}>
                    Imagen de la estación
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                    {selectedImageName || 'Importa una imagen o elige una ya cargada.'}
                  </Typography>
                  {imageError && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                      {imageError}
                    </Typography>
                  )}
                </Box>

                <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<UploadFileIcon />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={saving}
                  >
                    Importar
                  </Button>
                  {selectedImage && (
                    <Button
                      type="button"
                      color="error"
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={clearImage}
                      disabled={saving}
                    >
                      Quitar
                    </Button>
                  )}
                </Stack>
              </Box>

              {importedImages.length > 0 && (
                <Box>
                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
                    <CollectionsIcon color="action" fontSize="small" />
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>
                      Elegir imagen existente
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      overflowX: 'auto',
                      pb: 0.5,
                    }}
                  >
                    {importedImages.map((image) => {
                      const isSelected = selectedImage === image.imageDataUrl;

                      return (
                        <ButtonBase
                          key={image.id}
                          onClick={() => selectImportedImage(image)}
                          disabled={saving}
                          aria-label={`Usar imagen de ${image.exerciseName}`}
                          sx={{
                            width: 88,
                            flex: '0 0 88px',
                            borderRadius: 1,
                            border: '2px solid',
                            borderColor: isSelected ? 'primary.main' : 'divider',
                            overflow: 'hidden',
                            display: 'block',
                            bgcolor: 'background.paper',
                            textAlign: 'left',
                          }}
                        >
                          <Box
                            component="img"
                            src={image.imageDataUrl}
                            alt={image.exerciseName}
                            sx={{ width: '100%', height: 58, objectFit: 'cover', display: 'block' }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              px: 0.75,
                              py: 0.5,
                              fontWeight: 700,
                              lineHeight: 1.1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {image.exerciseName}
                          </Typography>
                        </ButtonBase>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(submit)}
          disabled={saving}
          startIcon={saving ? <CircularProgress color="inherit" size={16} /> : null}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateExerciseDialog;
