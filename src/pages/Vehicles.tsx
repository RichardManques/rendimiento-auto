import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Container,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import { Vehicle } from '../types';
import { vehicleService } from '../services/vehicleService';
import VehicleFormDialog from '../components/VehicleFormDialog';
import { useSnackbar } from 'notistack';

const Vehicles: React.FC = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehicleService.getVehicles();
      const vehiclesWithDefaults = response.data.map(vehicle => ({
        ...vehicle,
        isDefault: vehicle.isDefault || false,
        transmission: vehicle.transmission || '',
        fuelType: vehicle.fuelType || '',
        engineSize: vehicle.engineSize || 0
      }));
      setVehicles(vehiclesWithDefaults);
      setError(null);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
      setError('Error al cargar los vehículos');
      enqueueSnackbar('Error al cargar los vehículos', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (vehicle?: Vehicle) => {
    if (vehicle) {
      setSelectedVehicle(vehicle);
    } else {
      setSelectedVehicle(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVehicle(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await vehicleService.deleteVehicle(id);
      setVehicles(vehicles.filter(vehicle => vehicle._id !== id));
      enqueueSnackbar('Vehículo eliminado correctamente', { variant: 'success' });
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      enqueueSnackbar('Error al eliminar el vehículo', { variant: 'error' });
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle({
      ...vehicle,
      isDefault: vehicle.isDefault || false,
      transmission: vehicle.transmission || '',
      fuelType: vehicle.fuelType || '',
      engineSize: vehicle.engineSize || 0
    });
    setOpenDialog(true);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: 'text.primary',
                mb: 1
              }}
            >
              Mis Vehículos
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: 'text.secondary' }}
            >
              Gestiona tu flota de vehículos y monitorea su rendimiento
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              borderRadius: 2,
              py: 1.5,
              px: 3,
              backgroundColor: theme.palette.primary.main,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                boxShadow: '0 8px 16px -4px rgba(25, 118, 210, 0.24)',
              }
            }}
          >
            Agregar Vehículo
          </Button>
        </Box>

        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3
        }}>
          {vehicles.map((vehicle) => (
            <Card 
              key={vehicle._id}
              sx={{ 
                borderRadius: 2,
                border: '1px solid',
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.background.paper,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px -4px rgba(145, 158, 171, 0.12)'
                }
              }}
            >
              <Box sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  mb: 3
                }}>
                  <Box
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      borderRadius: 1.5,
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}
                  >
                    <DirectionsCarIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600,
                      color: 'text.primary',
                      mb: 0.5,
                      lineHeight: 1.2
                    }}>
                      {vehicle.brand}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {vehicle.model}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 2,
                  mb: 3
                }}>
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <CalendarTodayIcon sx={{ 
                      fontSize: 20,
                      color: theme.palette.text.secondary
                    }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {vehicle.year}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <SettingsIcon sx={{ 
                      fontSize: 20,
                      color: theme.palette.text.secondary
                    }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {vehicle.transmission}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <LocalGasStationIcon sx={{ 
                      fontSize: 20,
                      color: theme.palette.text.secondary
                    }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {vehicle.fuelType}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        py: 0.5,
                        px: 1.5,
                        borderRadius: 1,
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                        fontWeight: 600
                      }}
                    >
                      {vehicle.engineSize}L
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ 
                  backgroundColor: alpha(theme.palette.background.default, 0.8),
                  borderRadius: 2,
                  p: 2
                }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 2,
                      color: 'text.primary'
                    }}
                  >
                    Consumo Promedio
                  </Typography>
                  {typeof vehicle.consumption === 'object' && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Ciudad
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: theme.palette.primary.main,
                            fontWeight: 600
                          }}
                        >
                          {vehicle.consumption.city}L/100km
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Carretera
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: theme.palette.primary.main,
                            fontWeight: 600
                          }}
                        >
                          {vehicle.consumption.highway}L/100km
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Mixto
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: theme.palette.primary.main,
                            fontWeight: 600
                          }}
                        >
                          {vehicle.consumption.mixed}L/100km
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: 1, 
                  mt: 2,
                  pt: 2,
                  borderTop: `1px solid ${theme.palette.divider}`
                }}>
                  <IconButton
                    onClick={() => handleEditVehicle(vehicle)}
                    sx={{
                      width: 36,
                      height: 36,
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                        '& svg': {
                          color: 'white'
                        }
                      }
                    }}
                  >
                    <EditIcon sx={{ 
                      fontSize: 18,
                      color: theme.palette.primary.main,
                      transition: 'color 0.2s'
                    }} />
                  </IconButton>
                  <IconButton
                    onClick={() => vehicle._id && handleDelete(vehicle._id)}
                    sx={{
                      width: 36,
                      height: 36,
                      backgroundColor: alpha(theme.palette.error.main, 0.08),
                      '&:hover': {
                        backgroundColor: theme.palette.error.main,
                        '& svg': {
                          color: 'white'
                        }
                      }
                    }}
                  >
                    <DeleteIcon sx={{ 
                      fontSize: 18,
                      color: theme.palette.error.main,
                      transition: 'color 0.2s'
                    }} />
                  </IconButton>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>

        <VehicleFormDialog
          open={openDialog}
          onClose={handleCloseDialog}
          initialData={selectedVehicle || undefined}
          onSubmit={async (vehicleData) => {
            try {
              if (selectedVehicle?._id) {
                await vehicleService.updateVehicle(selectedVehicle._id, vehicleData);
                enqueueSnackbar('Vehículo actualizado correctamente', { variant: 'success' });
              } else {
                await vehicleService.createVehicle(vehicleData);
                enqueueSnackbar('Vehículo creado correctamente', { variant: 'success' });
              }
              handleCloseDialog();
              loadVehicles();
            } catch (error) {
              console.error('Error al guardar vehículo:', error);
              enqueueSnackbar('Error al guardar el vehículo', { variant: 'error' });
            }
          }}
        />
      </Box>
    </Container>
  );
};

export default Vehicles; 