import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Switch
} from '@mui/material';
import { FuelRecord } from '../types';
import { fuelService } from '../services/api';
import { efficiencyService, EfficiencyRecord } from '../services/efficiencyService';
import { vehicleService } from '../services/vehicleService';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SaveIcon from '@mui/icons-material/Save';
import { useSnackbar } from 'notistack';
import SpeedIcon from '@mui/icons-material/Speed';
import AcUnitIcon from '@mui/icons-material/AcUnit';

interface TripRecord {
  userId: string;
  vehicleId: string;
  startKm: number;
  endKm: number;
  kmConsumed: number;
  drivingStyle: 'suave' | 'normal' | 'agresivo';
  routeType: 'ciudad' | 'carretera' | 'mixta';
  useAC: boolean;
  efficiency: {
    base: number;
    adjusted: number;
  };
  cost: {
    perKm: number;
    total: number;
  };
  date: Date;
  location: {
    start?: string;
    end?: string;
  };
}

const FuelEfficiency: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [vehicles, setVehicles] = useState<Array<{ _id: string; model: string }>>([]);
  const [tripData, setTripData] = useState<Omit<EfficiencyRecord, '_id' | 'userId'>>({
    vehicleId: '',
    startKm: 0,
    endKm: 0,
    kmConsumed: 0,
    drivingStyle: 'normal',
    routeType: 'mixta',
    useAC: false,
    efficiency: {
      base: 0,
      adjusted: 0
    },
    cost: {
      perKm: 0,
      total: 0
    },
    date: new Date(),
    location: {
      start: '',
      end: ''
    }
  });

  const [efficiency, setEfficiency] = useState<{
    kmConsumed: number;
    costPerKm: number;
    tripCost: number;
    adjustedEfficiency: number;
    baseEfficiency: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  // Rendimiento base (carretera en condiciones óptimas)
  const BASE_EFFICIENCY = 18.0; // km/L en carretera

  // Factores que afectan el rendimiento
  const drivingStyleFactors = {
    suave: 1.0,    // Mantiene el rendimiento base
    normal: 0.9,   // 10% menos rendimiento
    agresivo: 0.8  // 20% menos rendimiento
  };

  const routeTypeFactors = {
    carretera: 1.0,     // 18 km/L (rendimiento óptimo)
    mixta: 0.81,        // 14.6 km/L (81% del rendimiento en carretera)
    ciudad: 0.61        // 10.9 km/L (61% del rendimiento en carretera)
  };

  const acFactor = 0.9;  // 10% menos rendimiento con AC

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        console.log('🚗 Cargando vehículos del usuario...');
        const response = await vehicleService.getVehicles();
        console.log('✅ Vehículos cargados:', response.data);
        setVehicles(response.data);
      } catch (error) {
        console.error('❌ Error al cargar vehículos:', error);
        enqueueSnackbar('Error al cargar los vehículos', { variant: 'error' });
      }
    };

    loadVehicles();
  }, [enqueueSnackbar]);

  const calculateEfficiency = () => {
    if (!tripData.vehicleId) {
      setError('Por favor selecciona un vehículo');
      return;
    }

    const { startKm, endKm, drivingStyle, routeType, useAC } = tripData;
    
    // Validaciones básicas
    if (startKm <= endKm) {
      setError('Los kilómetros disponibles iniciales deben ser mayores a los finales');
      return;
    }

    // Cálculos base
    const kmConsumed = startKm - endKm; // Kilómetros consumidos
    
    // Factores de ajuste
    const totalFactor = drivingStyleFactors[drivingStyle] * 
                       routeTypeFactors[routeType] * 
                       (useAC ? acFactor : 1.0);

    // Rendimiento ajustado según condiciones
    const baseEfficiency = 18.0; // Rendimiento base en carretera
    const adjustedEfficiency = baseEfficiency * totalFactor;
    
    // Costo por kilómetro (usando precio de $1,250 por litro)
    const costPerKm = Number((1250 / adjustedEfficiency).toFixed(2));
    const tripCost = Number((kmConsumed * costPerKm).toFixed(2));

    // Actualizar el estado con los nuevos valores
    setTripData(prev => ({
      ...prev,
      kmConsumed,
      efficiency: {
        base: baseEfficiency,
        adjusted: Number(adjustedEfficiency.toFixed(1))
      },
      cost: {
        perKm: costPerKm,
        total: tripCost
      }
    }));

    // Mostrar los resultados
    setEfficiency({
      kmConsumed,
      costPerKm,
      tripCost,
      adjustedEfficiency: Number(adjustedEfficiency.toFixed(1)),
      baseEfficiency
    });
    setError('');
  };

  const saveRecord = async () => {
    try {
      if (!tripData.vehicleId) {
        setError('Por favor selecciona un vehículo');
        return;
      }

      if (!efficiency) {
        setError('No hay datos de eficiencia para guardar');
        return;
      }

      const recordToSave = {
        ...tripData,
        kmConsumed: efficiency.kmConsumed,
        efficiency: {
          base: efficiency.baseEfficiency,
          adjusted: efficiency.adjustedEfficiency
        },
        cost: {
          perKm: efficiency.costPerKm,
          total: efficiency.tripCost
        }
      };

      console.log('💾 Guardando registro de eficiencia:', recordToSave);
      await efficiencyService.createRecord(recordToSave);
      
      enqueueSnackbar('Registro de eficiencia guardado correctamente', { variant: 'success' });
      
      // Limpiar el formulario después de guardar
      setTripData({
        vehicleId: '',
        startKm: 0,
        endKm: 0,
        kmConsumed: 0,
        drivingStyle: 'normal',
        routeType: 'mixta',
        useAC: false,
        efficiency: {
          base: 0,
          adjusted: 0
        },
        cost: {
          perKm: 0,
          total: 0
        },
        date: new Date(),
        location: {
          start: '',
          end: ''
        }
      });
      setEfficiency(null);
      setError('');
    } catch (error) {
      console.error('❌ Error al guardar el registro:', error);
      setError('Error al guardar el registro');
      enqueueSnackbar('Error al guardar el registro de eficiencia', { variant: 'error' });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number);
  };

  const formatKm = (number: number) => {
    return new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  // Función para formatear la fecha en zona horaria de Chile
  const formatDateToChile = (date: Date) => {
    return date.toLocaleString('es-CL', {
      timeZone: 'America/Santiago',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', '').replace(/\//g, '-');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cálculo de Rendimiento
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Calcula el rendimiento real considerando tu estilo de conducción
        </Typography>

        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, md: 6 },
            mb: 4,
            borderRadius: 4,
            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #1976d2, #2196f3)',
              opacity: 0.8
            }
          }}
        >
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: { xs: 4, md: 6 }
          }}>
            {/* Columna Izquierda */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Sección de Kilometraje */}
              <Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5, 
                  mb: 3,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '40px',
                    height: '3px',
                    background: 'primary.main',
                    borderRadius: 2
                  }
                }}>
                  <SpeedIcon sx={{ 
                    color: 'primary.main',
                    fontSize: 28,
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    p: 1,
                    borderRadius: 2
                  }} />
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700,
                    letterSpacing: '-0.5px',
                    color: 'text.primary'
                  }}>
                    Kilometraje del Viaje
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 3,
                  '& .MuiTextField-root': {
                    backgroundColor: 'background.paper',
                    borderRadius: 3,
                    transition: 'all 0.2s ease',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderWidth: 2
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500
                    }
                  }
                }}>
                  <TextField
                    fullWidth
                    label="Kilómetros Iniciales"
                    type="number"
                    value={tripData.startKm}
                    onChange={(e) => setTripData({ ...tripData, startKm: Number(e.target.value) })}
                    InputProps={{
                      endAdornment: (
                        <Typography 
                          color="text.secondary" 
                          sx={{ 
                            pr: 1,
                            fontWeight: 600,
                            fontSize: '0.9rem'
                          }}
                        >
                          km
                        </Typography>
                      )
                    }}
                    helperText="Kilómetros disponibles al inicio"
                  />
                  <TextField
                    fullWidth
                    label="Kilómetros Finales"
                    type="number"
                    value={tripData.endKm}
                    onChange={(e) => setTripData({ ...tripData, endKm: Number(e.target.value) })}
                    InputProps={{
                      endAdornment: (
                        <Typography 
                          color="text.secondary" 
                          sx={{ 
                            pr: 1,
                            fontWeight: 600,
                            fontSize: '0.9rem'
                          }}
                        >
                          km
                        </Typography>
                      )
                    }}
                    helperText="Kilómetros disponibles al final"
                  />
                </Box>
              </Box>

              {/* Sección de Condiciones de Conducción */}
              <Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5, 
                  mb: 3,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '40px',
                    height: '3px',
                    background: 'primary.main',
                    borderRadius: 2
                  }
                }}>
                  <DirectionsCarIcon sx={{ 
                    color: 'primary.main',
                    fontSize: 28,
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    p: 1,
                    borderRadius: 2
                  }} />
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700,
                    letterSpacing: '-0.5px',
                    color: 'text.primary'
                  }}>
                    Condiciones de Conducción
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 3,
                  '& .MuiFormControl-root': {
                    backgroundColor: 'background.paper',
                    borderRadius: 3,
                    transition: 'all 0.2s ease',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderWidth: 2
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500
                    }
                  }
                }}>
                  <FormControl fullWidth>
                    <InputLabel>Estilo de Conducción</InputLabel>
                    <Select
                      value={tripData.drivingStyle}
                      onChange={(e) => setTripData({ ...tripData, drivingStyle: e.target.value as 'suave' | 'normal' | 'agresivo' })}
                      label="Estilo de Conducción"
                    >
                      <MenuItem value="suave">Suave (Económico)</MenuItem>
                      <MenuItem value="normal">Normal</MenuItem>
                      <MenuItem value="agresivo">Agresivo (Deportivo)</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Ruta</InputLabel>
                    <Select
                      value={tripData.routeType}
                      onChange={(e) => setTripData({ ...tripData, routeType: e.target.value as 'ciudad' | 'carretera' | 'mixta' })}
                      label="Tipo de Ruta"
                    >
                      <MenuItem value="ciudad">Ciudad (Tráfico)</MenuItem>
                      <MenuItem value="carretera">Carretera</MenuItem>
                      <MenuItem value="mixta">Mixta</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>

            {/* Columna Derecha */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Sección de Vehículo */}
              <Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5, 
                  mb: 3,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '40px',
                    height: '3px',
                    background: 'primary.main',
                    borderRadius: 2
                  }
                }}>
                  <LocalGasStationIcon sx={{ 
                    color: 'primary.main',
                    fontSize: 28,
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    p: 1,
                    borderRadius: 2
                  }} />
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700,
                    letterSpacing: '-0.5px',
                    color: 'text.primary'
                  }}>
                    Vehículo
                  </Typography>
                </Box>
                <FormControl 
                  fullWidth
                  sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: 3,
                    transition: 'all 0.2s ease',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderWidth: 2
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500
                    }
                  }}
                >
                  <InputLabel>Selecciona tu Vehículo</InputLabel>
                  <Select
                    value={tripData.vehicleId}
                    onChange={(e) => setTripData({ ...tripData, vehicleId: e.target.value })}
                    label="Selecciona tu Vehículo"
                    required
                  >
                    <MenuItem value="">
                      <em>Selecciona un vehículo</em>
                    </MenuItem>
                    {vehicles.map((vehicle) => (
                      <MenuItem key={vehicle._id} value={vehicle._id}>
                        {vehicle.model}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Sección de Condiciones Adicionales */}
              <Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5, 
                  mb: 3,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '40px',
                    height: '3px',
                    background: 'primary.main',
                    borderRadius: 2
                  }
                }}>
                  <AcUnitIcon sx={{ 
                    color: 'primary.main',
                    fontSize: 28,
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    p: 1,
                    borderRadius: 2
                  }} />
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700,
                    letterSpacing: '-0.5px',
                    color: 'text.primary'
                  }}>
                    Condiciones Adicionales
                  </Typography>
                </Box>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: 'background.paper',
                    transition: 'all 0.3s ease',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={tripData.useAC}
                        onChange={(e) => setTripData({ ...tripData, useAC: e.target.checked })}
                        sx={{
                          '& .MuiSwitch-thumb': {
                            backgroundColor: tripData.useAC ? 'primary.main' : 'grey.400',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          },
                          '& .MuiSwitch-track': {
                            backgroundColor: tripData.useAC ? 'primary.light' : 'grey.300',
                            opacity: 1
                          }
                        }}
                      />
                    }
                    label={
                      <Typography variant="body1" sx={{ 
                        fontWeight: 600,
                        color: 'text.primary'
                      }}>
                        Uso de Aire Acondicionado
                      </Typography>
                    }
                  />
                </Paper>
              </Box>
            </Box>
          </Box>

          <Box sx={{ 
            mt: 6, 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 3 
          }}>
            <Button
              variant="contained"
              onClick={calculateEfficiency}
              startIcon={<DirectionsCarIcon />}
              sx={{ 
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '-0.5px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)',
                  background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Calcular Rendimiento
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={saveRecord}
              startIcon={<SaveIcon />}
              disabled={!efficiency}
              sx={{ 
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '-0.5px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)',
                  background: 'linear-gradient(45deg, #1b5e20 30%, #388e3c 90%)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Guardar Registro
            </Button>
          </Box>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {efficiency && (
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3,
            mt: 4
          }}>
            <Box sx={{ 
              flex: '1 1 calc(33.333% - 24px)', 
              minWidth: '280px',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(145deg, rgba(25, 118, 210, 0.05), rgba(25, 118, 210, 0.02))',
                borderRadius: 4,
                zIndex: 0
              }
            }}>
              <Card sx={{
                height: '100%',
                background: 'transparent',
                backdropFilter: 'blur(8px)',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 4,
                transition: 'all 0.3s ease',
                overflow: 'visible',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                  '& .icon-wrapper': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)'
                  }
                }
              }}>
                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                  <Box className="icon-wrapper" sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #1976d2, #2196f3)',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                    mb: 2,
                    transition: 'all 0.3s ease',
                    mx: 'auto'
                  }}>
                    <DirectionsCarIcon sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                  <Typography variant="h6" align="center" sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 3
                  }}>
                    Rendimiento Base vs Real
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    mb: 2
                  }}>
                    <Typography variant="h3" align="center" sx={{
                      background: 'linear-gradient(135deg, #1976d2, #2196f3)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 700
                    }}>
                      {efficiency.baseEfficiency}
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      px: 2
                    }}>
                      <Typography variant="h5" sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          width: '20px',
                          height: '2px',
                          background: 'linear-gradient(90deg, #1976d2, #2196f3)',
                          right: '-30px',
                          top: '50%',
                          transform: 'translateY(-50%)'
                        }
                      }}>
                        →
                      </Typography>
                    </Box>
                    <Typography variant="h3" align="center" sx={{
                      background: 'linear-gradient(135deg, #1976d2, #2196f3)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 700
                    }}>
                      {efficiency.adjustedEfficiency}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'text.secondary', ml: 1 }}>
                      km/L
                    </Typography>
                  </Box>
                  <Typography variant="body2" align="center" sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    letterSpacing: '0.2px'
                  }}>
                    Rendimiento ajustado según tu estilo
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ 
              flex: '1 1 calc(33.333% - 24px)', 
              minWidth: '280px',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(145deg, rgba(46, 125, 50, 0.05), rgba(46, 125, 50, 0.02))',
                borderRadius: 4,
                zIndex: 0
              }
            }}>
              <Card sx={{
                height: '100%',
                background: 'transparent',
                backdropFilter: 'blur(8px)',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 4,
                transition: 'all 0.3s ease',
                overflow: 'visible',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                  '& .icon-wrapper': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 8px 16px rgba(46, 125, 50, 0.2)'
                  }
                }
              }}>
                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                  <Box className="icon-wrapper" sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
                    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.15)',
                    mb: 2,
                    transition: 'all 0.3s ease',
                    mx: 'auto'
                  }}>
                    <AttachMoneyIcon sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                  <Typography variant="h6" align="center" sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 3
                  }}>
                    Costo por Kilómetro
                  </Typography>
                  <Typography variant="h3" align="center" sx={{
                    background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                    mb: 2
                  }}>
                    {formatCurrency(efficiency.costPerKm)}
                  </Typography>
                  <Typography variant="body2" align="center" sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    letterSpacing: '0.2px'
                  }}>
                    Basado en rendimiento real
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ 
              flex: '1 1 calc(33.333% - 24px)', 
              minWidth: '280px',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(145deg, rgba(0, 127, 255, 0.05), rgba(0, 127, 255, 0.02))',
                borderRadius: 4,
                zIndex: 0
              }
            }}>
              <Card sx={{
                height: '100%',
                background: 'transparent',
                backdropFilter: 'blur(8px)',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 4,
                transition: 'all 0.3s ease',
                overflow: 'visible',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                  '& .icon-wrapper': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 8px 16px rgba(0, 127, 255, 0.2)'
                  }
                }
              }}>
                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                  <Box className="icon-wrapper" sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0062cc, #0091ff)',
                    boxShadow: '0 4px 12px rgba(0, 127, 255, 0.15)',
                    mb: 2,
                    transition: 'all 0.3s ease',
                    mx: 'auto'
                  }}>
                    <LocalGasStationIcon sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                  <Typography variant="h6" align="center" sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 3
                  }}>
                    Resumen del Viaje
                  </Typography>
                  <Typography variant="h3" align="center" sx={{
                    background: 'linear-gradient(135deg, #0062cc, #0091ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                    mb: 2
                  }}>
                    {formatCurrency(efficiency.tripCost)}
                  </Typography>
                  <Typography variant="body2" align="center" sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    letterSpacing: '0.2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5
                  }}>
                    <Box component="span" sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: 'linear-gradient(135deg, #0062cc, #0091ff)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 700
                    }}>
                      {efficiency.kmConsumed}
                    </Box>
                    km recorridos
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default FuelEfficiency; 