import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box
} from '@mui/material';
import { Vehicle } from '../types';
import { useSnackbar } from 'notistack';

interface VehicleFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (vehicle: Omit<Vehicle, '_id' | 'userId'>) => void;
  initialData?: Partial<Vehicle>;
}

const VehicleFormDialog: React.FC<VehicleFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<Omit<Vehicle, '_id' | 'userId'>>({
    model: initialData?.model || '',
    brand: initialData?.brand || '',
    year: initialData?.year || new Date().getFullYear(),
    plate: initialData?.plate || '',
    isDefault: initialData?.isDefault || false,
    transmission: initialData?.transmission || '',
    fuelType: initialData?.fuelType || '',
    engineSize: initialData?.engineSize || 0,
    consumption: {
      city: initialData?.consumption?.city || 0,
      highway: initialData?.consumption?.highway || 0,
      mixed: initialData?.consumption?.mixed || 0
    },
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const handleSubmit = () => {
    if (!formData.model || !formData.brand || !formData.plate) {
      enqueueSnackbar('Por favor completa todos los campos requeridos', { variant: 'error' });
      return;
    }

    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? 'Editar Vehículo' : 'Nuevo Vehículo'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 1 }}>
          <Box>
            <TextField
              fullWidth
              label="Marca"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              required
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label="Modelo"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              required
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label="Año"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              required
            />
          </Box>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Typography variant="subtitle1" gutterBottom>
              Consumo (km/L)
            </Typography>
          </Box>
          <Box>
            <TextField
              fullWidth
              label="Ciudad"
              type="number"
              value={formData.consumption.city}
              onChange={(e) => setFormData({
                ...formData,
                consumption: { ...formData.consumption, city: Number(e.target.value) }
              })}
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label="Carretera"
              type="number"
              value={formData.consumption.highway}
              onChange={(e) => setFormData({
                ...formData,
                consumption: { ...formData.consumption, highway: Number(e.target.value) }
              })}
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label="Mixto"
              type="number"
              value={formData.consumption.mixed}
              onChange={(e) => setFormData({
                ...formData,
                consumption: { ...formData.consumption, mixed: Number(e.target.value) }
              })}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {initialData ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VehicleFormDialog; 