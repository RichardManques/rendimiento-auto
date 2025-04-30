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
  Slide,
  alpha,
  Tooltip,
  LinearProgress,
  Divider
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined';
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

  const [errors, setErrors] = useState({
    pricePerLiter: '',
    totalAmount: '',
    gasStation: '',
    location: ''
  });

  const [touched, setTouched] = useState({
    pricePerLiter: false,
    totalAmount: false,
    gasStation: false,
    location: false
  });

  const [calculatedLiters, setCalculatedLiters] = useState<number>(0);

  // Calculate form completion percentage
  const getCompletionPercentage = () => {
    const fields = Object.values(formData);
    const filledFields = fields.filter(field => field !== '').length;
    return (filledFields / fields.length) * 100;
  };

  useEffect(() => {
    if (Number(formData.pricePerLiter) > 0 && Number(formData.totalAmount) > 0) {
      const liters = Number(formData.totalAmount) / Number(formData.pricePerLiter);
      setCalculatedLiters(Number(liters.toFixed(1)));
    } else {
      setCalculatedLiters(0);
    }
  }, [formData.pricePerLiter, formData.totalAmount]);

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'pricePerLiter':
        if (!value) error = 'El precio por litro es requerido';
        else if (Number(value) <= 0) error = 'El precio debe ser mayor a 0';
        break;
      case 'totalAmount':
        if (!value) error = 'El monto total es requerido';
        else if (Number(value) <= 0) error = 'El monto debe ser mayor a 0';
        break;
      case 'gasStation':
        if (!value) error = 'La estación de servicio es requerida';
        else if (value.length < 3) error = 'Ingresa un nombre válido';
        break;
      case 'location':
        if (!value) error = 'La ubicación es requerida';
        else if (value.length < 3) error = 'Ingresa una ubicación válida';
        break;
    }
    return error;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, formData[name as keyof typeof formData])
    }));
  };

  const handleSubmit = () => {
    // Validate all fields
    const newErrors = {
      pricePerLiter: validateField('pricePerLiter', formData.pricePerLiter),
      totalAmount: validateField('totalAmount', formData.totalAmount),
      gasStation: validateField('gasStation', formData.gasStation),
      location: validateField('location', formData.location)
    };

    setErrors(newErrors);
    setTouched({
      pricePerLiter: true,
      totalAmount: true,
      gasStation: true,
      location: true
    });

    if (Object.values(newErrors).every(error => !error)) {
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
      setTouched({
        pricePerLiter: false,
        totalAmount: false,
        gasStation: false,
        location: false
      });
    }
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
      maxWidth="sm"
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: '24px',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '500px',
          margin: 'auto',
          background: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(20px)',
          boxShadow: `0 25px 50px -12px ${alpha(theme.palette.common.black, 0.25)}`,
        }
      }}
    >
      <Box 
        sx={{ 
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.6)})`,
            zIndex: 1,
          }
        }}
      >
        <LinearProgress 
          variant="determinate" 
          value={getCompletionPercentage()} 
          sx={{
            height: '4px',
            backgroundColor: 'transparent',
            '& .MuiLinearProgress-bar': {
              background: `linear-gradient(90deg, ${theme.palette.success.main}, ${alpha(theme.palette.success.main, 0.8)})`,
              transition: 'transform 0.4s ease-in-out',
            },
          }}
        />

        <IconButton 
          onClick={onClose}
          sx={{ 
            position: 'absolute',
            right: 16,
            top: 16,
            color: alpha(theme.palette.text.primary, 0.6),
            backgroundColor: alpha(theme.palette.divider, 0.04),
            backdropFilter: 'blur(4px)',
            '&:hover': {
              backgroundColor: alpha(theme.palette.divider, 0.08),
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '16px',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.dark, 0.85)})`,
                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
              }}>
                <LocalGasStationOutlinedIcon sx={{ 
                  color: '#fff',
                  fontSize: 24,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }} />
              </Box>
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${alpha(theme.palette.text.primary, 0.8)})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Nueva Recarga
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: alpha(theme.palette.text.primary, 0.6),
                    mt: 0.5 
                  }}
                >
                  Ingresa los detalles de tu recarga de combustible
                </Typography>
              </Box>
            </Box>

            {showTotal && (
              <Paper 
                elevation={0}
                sx={{ 
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.dark, 0.9)})`,
                  color: 'white',
                  p: 3,
                  borderRadius: '20px',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  mb: 4,
                  boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
                  transform: 'translateY(0)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 16px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }
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
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  {formatCurrency(Number(formData.totalAmount))}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Equivale a {calculatedLiters.toFixed(1)} litros
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                  a {formatCurrency(Number(formData.pricePerLiter))}/L cada litro
                </Typography>
              </Paper>
            )}

            <Box sx={{ 
              display: 'grid',
              gap: 3,
              mb: 4
            }}>
              <Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: 2,
                    color: alpha(theme.palette.text.primary, 0.7),
                    fontWeight: 600 
                  }}
                >
                  Información de Precio
                </Typography>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <TextField
                    placeholder="Ingresa el precio por litro"
                    name="pricePerLiter"
                    type="number"
                    value={formData.pricePerLiter}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={touched.pricePerLiter && Boolean(errors.pricePerLiter)}
                    helperText={touched.pricePerLiter && errors.pricePerLiter}
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: alpha(theme.palette.background.paper, 0.6),
                        backdropFilter: 'blur(8px)',
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        },
                        '&.Mui-focused': {
                          backgroundColor: theme.palette.background.paper,
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography 
                            sx={{ 
                              color: alpha(theme.palette.text.primary, 0.7),
                              fontWeight: 500 
                            }}
                          >
                            $
                          </Typography>
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
                    onBlur={handleBlur}
                    error={touched.totalAmount && Boolean(errors.totalAmount)}
                    helperText={touched.totalAmount && errors.totalAmount}
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: alpha(theme.palette.background.paper, 0.6),
                        backdropFilter: 'blur(8px)',
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        },
                        '&.Mui-focused': {
                          backgroundColor: theme.palette.background.paper,
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography 
                            sx={{ 
                              color: alpha(theme.palette.text.primary, 0.7),
                              fontWeight: 500 
                            }}
                          >
                            $
                          </Typography>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
              </Box>

              <Divider sx={{ opacity: 0.1 }} />

              <Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: 2,
                    color: alpha(theme.palette.text.primary, 0.7),
                    fontWeight: 600 
                  }}
                >
                  Información de la Estación
                </Typography>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <TextField
                    placeholder="¿En qué estación cargaste?"
                    name="gasStation"
                    value={formData.gasStation}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={touched.gasStation && Boolean(errors.gasStation)}
                    helperText={touched.gasStation && errors.gasStation}
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: alpha(theme.palette.background.paper, 0.6),
                        backdropFilter: 'blur(8px)',
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        },
                        '&.Mui-focused': {
                          backgroundColor: theme.palette.background.paper,
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalGasStationIcon 
                            sx={{ 
                              color: alpha(theme.palette.text.primary, 0.4),
                              fontSize: 20 
                            }} 
                          />
                        </InputAdornment>
                      )
                    }}
                  />
                  <TextField
                    placeholder="¿Dónde queda la estación?"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={touched.location && Boolean(errors.location)}
                    helperText={touched.location && errors.location || "Ejemplo: Santiago, Las Condes"}
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: alpha(theme.palette.background.paper, 0.6),
                        backdropFilter: 'blur(8px)',
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        },
                        '&.Mui-focused': {
                          backgroundColor: theme.palette.background.paper,
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon 
                            sx={{ 
                              color: alpha(theme.palette.text.primary, 0.4),
                              fontSize: 20 
                            }} 
                          />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{ 
            p: 4, 
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
                borderRadius: '12px',
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: alpha(theme.palette.divider, 0.1),
                color: alpha(theme.palette.text.primary, 0.7),
                '&:hover': {
                  borderColor: alpha(theme.palette.divider, 0.2),
                  backgroundColor: alpha(theme.palette.divider, 0.04),
                },
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              variant="contained"
              fullWidth
              disabled={!formData.pricePerLiter || !formData.totalAmount || !formData.gasStation || !formData.location || 
                Object.values(errors).some(error => error !== '')}
              sx={{ 
                borderRadius: '12px',
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.dark, 0.9)})`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                transition: 'all 0.2s ease-in-out',
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