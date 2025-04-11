import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FuelRecord } from '../types';
import { useState } from 'react';

interface NewRecordModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: Omit<FuelRecord, '_id'>) => void;
}

const NewRecordModal: React.FC<NewRecordModalProps> = ({ open, onClose, onSubmit }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    pricePerLiter: '',
    totalLiters: '',
    stationName: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotal = () => {
    const price = Number(formData.pricePerLiter);
    const liters = Number(formData.totalLiters);
    const total = price * liters;
    console.log('Calculando total:', { price, liters, total });
    return total;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalCost = calculateTotal();
    
    const record: Omit<FuelRecord, '_id'> = {
      pricePerLiter: Number(formData.pricePerLiter),
      liters: Number(formData.totalLiters),
      totalCost: totalCost,
      date: new Date(),
      gasStation: formData.stationName,
      location: 'Santiago, Chile' // Valor por defecto
    };

    console.log('Enviando registro:', record);
    onSubmit(record);
    onClose();
    setFormData({ pricePerLiter: '', totalLiters: '', stationName: '' });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Nuevo Registro de Combustible
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Precio por Litro"
              name="pricePerLiter"
              type="number"
              value={formData.pricePerLiter}
              onChange={handleInputChange}
              required
              fullWidth
              InputProps={{
                startAdornment: <Typography color="textSecondary">$</Typography>
              }}
            />
            
            <TextField
              label="Litros Cargados"
              name="totalLiters"
              type="number"
              value={formData.totalLiters}
              onChange={handleInputChange}
              required
              fullWidth
              InputProps={{
                endAdornment: <Typography color="textSecondary">L</Typography>
              }}
            />
            
            <TextField
              label="Nombre de la Estación"
              name="stationName"
              value={formData.stationName}
              onChange={handleInputChange}
              required
              fullWidth
            />

            {(Number(formData.pricePerLiter) > 0 && Number(formData.totalLiters) > 0) && (
              <Box sx={{ 
                bgcolor: 'primary.light', 
                p: 2, 
                borderRadius: 1,
                color: 'white',
                textAlign: 'center'
              }}>
                <Typography variant="subtitle2">Total Estimado</Typography>
                <Typography variant="h4">
                  {formatCurrency(calculateTotal())}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={onClose} variant="outlined">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Guardar Registro
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NewRecordModal; 