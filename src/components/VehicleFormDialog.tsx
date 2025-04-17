import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  useTheme,
  alpha,
  Divider,
  Paper
} from '@mui/material';
import { Vehicle } from '../types';
import { useSnackbar } from 'notistack';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CloseIcon from '@mui/icons-material/Close';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';

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
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const defaultFormData = {
    model: '',
    brand: '',
    year: new Date().getFullYear(),
    isDefault: false,
    transmission: 'manual',
    fuelType: 'gasolina',
    engineSize: 1.6,
    consumption: {
      city: 0,
      highway: 0,
      mixed: 0
    },
    createdAt: new Date()
  };

  const [formData, setFormData] = useState<Omit<Vehicle, '_id' | 'userId'>>(defaultFormData);

  useEffect(() => {
    if (open && initialData) {
      setFormData({
        model: initialData.model || '',
        brand: initialData.brand || '',
        year: initialData.year || new Date().getFullYear(),
        isDefault: initialData.isDefault || false,
        transmission: initialData.transmission || 'manual',
        fuelType: initialData.fuelType || 'gasolina',
        engineSize: initialData.engineSize || 1.6,
        consumption: {
          city: initialData.consumption?.city || 0,
          highway: initialData.consumption?.highway || 0,
          mixed: initialData.consumption?.mixed || 0
        },
        createdAt: initialData.createdAt || new Date()
      });
    } else if (!open) {
      setFormData(defaultFormData);
    }
  }, [initialData, open]);

  const handleSubmit = () => {
    if (!formData.model || !formData.brand || !formData.year || !formData.engineSize || 
        !formData.fuelType || !formData.transmission || 
        !formData.consumption.city || !formData.consumption.highway || !formData.consumption.mixed) {
      enqueueSnackbar('Por favor completa todos los campos requeridos', { variant: 'error' });
      return;
    }

    try {
      onSubmit(formData);
    } catch (error) {
      console.error('Error al guardar el vehículo:', error);
      enqueueSnackbar('Error al guardar el vehículo', { variant: 'error' });
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: 'transparent',
      border: '1px solid',
      borderColor: alpha(theme.palette.divider, 0.1),
      backdropFilter: 'blur(8px)',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        borderColor: alpha(theme.palette.primary.main, 0.3),
        backgroundColor: alpha(theme.palette.background.paper, 0.02),
      },
      '&.Mui-focused': {
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.background.paper, 0.05),
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'transparent'
        }
      }
    },
    '& .MuiInputLabel-root': {
      fontWeight: 500,
      '&.Mui-focused': {
        color: theme.palette.primary.main
      }
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: theme.palette.mode === 'dark' 
            ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.94)})`
            : `linear-gradient(145deg, ${alpha('#fff', 0.9)}, ${alpha('#fff', 0.94)})`,
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.1),
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ 
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.main, 0.05)})`,
          zIndex: 0
        }
      }}>
        <DialogTitle sx={{ 
          p: 4,
          pb: 3,
          position: 'relative',
          zIndex: 1
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.light, 0.8)})`,
                boxShadow: `0 8px 16px -4px ${alpha(theme.palette.primary.main, 0.2)}`
              }}>
                <TimeToLeaveIcon sx={{ color: '#fff', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${alpha(theme.palette.text.primary, 0.8)})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {initialData ? 'Editar Vehículo' : 'Nuevo Vehículo'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  {initialData ? 'Actualiza la información de tu vehículo' : 'Añade un nuevo vehículo a tu flota'}
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={onClose}
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.divider, 0.08),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.divider, 0.12)
                }
              }}
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 3, pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Información básica */}
            <Paper elevation={0} sx={{ 
              p: 2.5,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.4),
              backdropFilter: 'blur(8px)',
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.08)
            }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DriveEtaIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Información del Vehículo
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                gap: 2
              }}>
                <TextField
                  fullWidth
                  label="Marca"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  required
                  sx={inputStyles}
                />
                <TextField
                  fullWidth
                  label="Modelo"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  required
                  sx={inputStyles}
                />
              </Box>
            </Paper>

            {/* Especificaciones técnicas */}
            <Paper elevation={0} sx={{ 
              p: 2.5,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.4),
              backdropFilter: 'blur(8px)',
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.08)
            }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SettingsIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Especificaciones Técnicas
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, 
                gap: 2
              }}>
                <TextField
                  fullWidth
                  label="Año"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  required
                  InputProps={{
                    startAdornment: (
                      <CalendarTodayIcon sx={{ mr: 1, color: alpha(theme.palette.primary.main, 0.7), fontSize: 20 }} />
                    ),
                  }}
                  sx={{
                    ...inputStyles,
                    '& .MuiOutlinedInput-root': {
                      ...inputStyles['& .MuiOutlinedInput-root'],
                      '& input': {
                        py: 1.5,
                        px: 1
                      }
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Cilindrada (L)"
                  type="number"
                  value={formData.engineSize}
                  onChange={(e) => setFormData({ ...formData, engineSize: Number(e.target.value) })}
                  inputProps={{ 
                    step: 0.1,
                    min: 0
                  }}
                  required
                  InputProps={{
                    startAdornment: (
                      <SpeedIcon sx={{ mr: 1, color: alpha(theme.palette.primary.main, 0.7), fontSize: 20 }} />
                    ),
                  }}
                  sx={{
                    ...inputStyles,
                    '& .MuiOutlinedInput-root': {
                      ...inputStyles['& .MuiOutlinedInput-root'],
                      '& input': {
                        py: 1.5,
                        px: 1
                      }
                    }
                  }}
                />
                <FormControl 
                  fullWidth 
                  required 
                  sx={{
                    ...inputStyles,
                    '& .MuiOutlinedInput-root': {
                      ...inputStyles['& .MuiOutlinedInput-root'],
                      '& .MuiSelect-select': {
                        py: 1.5,
                        px: 1
                      }
                    }
                  }}
                >
                  <InputLabel>Transmisión</InputLabel>
                  <Select
                    value={formData.transmission}
                    label="Transmisión"
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                  >
                    <MenuItem value="manual">Manual</MenuItem>
                    <MenuItem value="automatica">Automática</MenuItem>
                  </Select>
                </FormControl>
                <FormControl 
                  fullWidth 
                  required 
                  sx={{
                    ...inputStyles,
                    '& .MuiOutlinedInput-root': {
                      ...inputStyles['& .MuiOutlinedInput-root'],
                      '& .MuiSelect-select': {
                        py: 1.5,
                        px: 1
                      }
                    }
                  }}
                >
                  <InputLabel>Tipo de Combustible</InputLabel>
                  <Select
                    value={formData.fuelType}
                    label="Tipo de Combustible"
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  >
                    <MenuItem value="gasolina">Gasolina</MenuItem>
                    <MenuItem value="diesel">Diésel</MenuItem>
                    <MenuItem value="gas">Gas</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Paper>

            {/* Consumo de combustible */}
            <Paper elevation={0} sx={{ 
              p: 2.5,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.4),
              backdropFilter: 'blur(8px)',
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.08)
            }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LocalGasStationIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Consumo de Combustible
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, 
                gap: 2
              }}>
                <TextField
                  fullWidth
                  label="Ciudad (L/100km)"
                  type="number"
                  value={formData.consumption.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    consumption: { ...formData.consumption, city: Number(e.target.value) }
                  })}
                  inputProps={{ step: 0.1 }}
                  required
                  sx={inputStyles}
                />
                <TextField
                  fullWidth
                  label="Carretera (L/100km)"
                  type="number"
                  value={formData.consumption.highway}
                  onChange={(e) => setFormData({
                    ...formData,
                    consumption: { ...formData.consumption, highway: Number(e.target.value) }
                  })}
                  inputProps={{ step: 0.1 }}
                  required
                  sx={inputStyles}
                />
                <TextField
                  fullWidth
                  label="Mixto (L/100km)"
                  type="number"
                  value={formData.consumption.mixed}
                  onChange={(e) => setFormData({
                    ...formData,
                    consumption: { ...formData.consumption, mixed: Number(e.target.value) }
                  })}
                  inputProps={{ step: 0.1 }}
                  required
                  sx={inputStyles}
                />
              </Box>
            </Paper>

            {/* Configuración adicional */}
            <Paper elevation={0} sx={{ 
              p: 2.5,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.4),
              backdropFilter: 'blur(8px)',
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.08)
            }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 600 }}>
                      Establecer como vehículo principal
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Este vehículo se seleccionará por defecto al crear nuevos registros
                    </Typography>
                  </Box>
                }
              />
            </Paper>
          </Box>
        </DialogContent>

        <DialogActions sx={{ 
          position: 'sticky',
          bottom: 0,
          p: 2,
          backgroundColor: theme.palette.background.paper,
          borderTop: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.08),
          gap: 1,
          zIndex: 1
        }}>
          <Button 
            onClick={onClose}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              borderColor: alpha(theme.palette.divider, 0.2),
              color: 'text.secondary',
              '&:hover': {
                borderColor: alpha(theme.palette.divider, 0.5),
                backgroundColor: alpha(theme.palette.divider, 0.05)
              }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              boxShadow: `0 8px 16px -4px ${alpha(theme.palette.primary.main, 0.2)}`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                boxShadow: `0 12px 24px -6px ${alpha(theme.palette.primary.main, 0.3)}`
              }
            }}
          >
            {initialData ? 'Actualizar Vehículo' : 'Crear Vehículo'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default VehicleFormDialog; 