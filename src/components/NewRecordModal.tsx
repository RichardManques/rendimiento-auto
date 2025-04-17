import React from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
  useTheme,
  Paper,
  InputAdornment,
  Slide
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { FuelRecord } from '../types';
import { useState, useEffect, forwardRef } from 'react';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface NewRecordModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: Omit<FuelRecord, '_id' | 'userId'>) => void;
  selectedVehicle?: { _id: string };
}

const NewRecordModal: React.FC<NewRecordModalProps> = ({ open, onClose, onSubmit, selectedVehicle }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    pricePerLiter: '',
    totalAmount: '',
    gasStation: '',
    location: ''
  });

  const [calculatedLiters, setCalculatedLiters] = useState<number>(0);

  useEffect(() => {
    if (Number(formData.pricePerLiter) > 0 && Number(formData.totalAmount) > 0) {
      const liters = Number(formData.totalAmount) / Number(formData.pricePerLiter);
      setCalculatedLiters(Number(liters.toFixed(1)));
    } else {
      setCalculatedLiters(0);
    }
  }, [formData.pricePerLiter, formData.totalAmount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const now = new Date();
    const record: Omit<FuelRecord, '_id' | 'userId'> = {
      date: now,
      pricePerLiter: Number(formData.pricePerLiter),
      liters: calculatedLiters,
      totalCost: Number(formData.totalAmount),
      gasStation: formData.gasStation,
      location: formData.location
    };

    onSubmit(record);
    onClose();
    setFormData({
      pricePerLiter: '',
      totalAmount: '',
      gasStation: '',
      location: ''
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const showTotal = Number(formData.pricePerLiter) > 0 && Number(formData.totalAmount) > 0;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          width: '400px',
          margin: 'auto',
          bgcolor: 'background.default'
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton 
          onClick={onClose}
          sx={{ 
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary'
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Nueva Recarga
            </Typography>
          </Box>

          {showTotal && (
            <Box sx={{ px: 3 }}>
              <Paper 
                elevation={0}
                sx={{ 
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  p: 3,
                  borderRadius: 3,
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  mb: 3
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    right: -20,
                    top: -20,
                    opacity: 0.1,
                    transform: 'rotate(25deg)'
                  }}
                >
                  <AttachMoneyIcon sx={{ fontSize: 150 }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {formatCurrency(Number(formData.totalAmount))}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Equivale a {calculatedLiters.toFixed(1)} litros
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
                  a {formatCurrency(Number(formData.pricePerLiter))}/L cada litro
                </Typography>
              </Paper>
            </Box>
          )}

          <Box sx={{ px: 3 }}>
            <Box sx={{ 
              display: 'grid',
              gap: 2.5,
              mb: 3
            }}>
              <TextField
                placeholder="Ingresa el precio por litro"
                name="pricePerLiter"
                type="number"
                value={formData.pricePerLiter}
                onChange={handleInputChange}
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography color="text.secondary">$</Typography>
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                placeholder="¿Cuánto pagaste en total?"
                name="totalAmount"
                type="number"
                value={formData.totalAmount}
                onChange={handleInputChange}
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography color="text.secondary">$</Typography>
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                placeholder="¿En qué estación cargaste?"
                name="gasStation"
                value={formData.gasStation}
                onChange={handleInputChange}
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalGasStationIcon color="action" fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                placeholder="¿Dónde queda la estación?"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                size="small"
                helperText="Ejemplo: Santiago, Las Condes"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon color="action" fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </Box>

          <Box sx={{ 
            p: 3, 
            pt: 0,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2
          }}>
            <Button 
              onClick={onClose}
              variant="outlined"
              fullWidth
              sx={{ 
                borderRadius: 2,
                py: 1,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              variant="contained"
              fullWidth
              disabled={!formData.pricePerLiter || !formData.totalAmount || !formData.gasStation || !formData.location}
              sx={{ 
                borderRadius: 2,
                py: 1,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Guardar
            </Button>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default NewRecordModal; 