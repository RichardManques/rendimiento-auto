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
  Chip,
  Tooltip,
  Stack,
  Divider,
  CircularProgress,
  Badge
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SpeedIcon from '@mui/icons-material/Speed';
import StarIcon from '@mui/icons-material/Star';
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
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.05)}, ${alpha(theme.palette.background.default, 0.95)})`,
        pt: 6,
        pb: 6
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 3,
          mb: 6
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box
              sx={{
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  borderRadius: '20px',
                  opacity: 0.5,
                  filter: 'blur(8px)',
                }
              }}
            >
              <Box sx={{
                width: 64,
                height: 64,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '16px',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.dark, 0.9)})`,
                boxShadow: `0 12px 24px -4px ${alpha(theme.palette.primary.main, 0.3)}`,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    transform: 'scale(1)',
                    boxShadow: `0 12px 24px -4px ${alpha(theme.palette.primary.main, 0.3)}`,
                  },
                  '50%': {
                    transform: 'scale(1.05)',
                    boxShadow: `0 16px 32px -4px ${alpha(theme.palette.primary.main, 0.4)}`,
                  },
                  '100%': {
                    transform: 'scale(1)',
                    boxShadow: `0 12px 24px -4px ${alpha(theme.palette.primary.main, 0.3)}`,
                  },
                },
              }}>
                <DirectionsCarIcon sx={{ 
                  color: '#fff',
                  fontSize: 32,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }} />
              </Box>
            </Box>
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${alpha(theme.palette.text.primary, 0.5)})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                  mb: 1
                }}
              >
                Mis Vehículos
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: alpha(theme.palette.text.primary, 0.6),
                    fontWeight: 500
                  }}
                >
                  {vehicles.length} vehículos registrados
                </Typography>
                <Chip
                  size="small"
                  icon={<StarIcon sx={{ fontSize: '1rem !important' }} />}
                  label="Premium"
                  sx={{
                    height: 24,
                    background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                    color: 'white',
                    '& .MuiChip-icon': {
                      color: 'white',
                    },
                    fontWeight: 600,
                  }}
                />
              </Stack>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              height: 48,
              px: 3,
              borderRadius: '14px',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.dark, 0.9)})`,
              textTransform: 'none',
              fontSize: '0.9375rem',
              fontWeight: 600,
              boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
              border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
              backdropFilter: 'blur(8px)',
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                transform: 'translateY(-1px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              transition: 'all 0.2s ease-in-out',
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
            lg: 'repeat(3, 1fr)',
            xl: 'repeat(4, 1fr)'
          },
          gap: 4
        }}>
          {vehicles.map((vehicle) => (
            <Card 
              key={vehicle._id}
              sx={{ 
                position: 'relative',
                borderRadius: '28px',
                background: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 32px 48px ${alpha(theme.palette.common.black, 0.12)}`,
                  '& .card-actions': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                  '& .vehicle-icon': {
                    transform: 'scale(1.1) rotate(-5deg)',
                  },
                  '&::before': {
                    opacity: 1,
                  }
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.4)})`,
                  opacity: 0,
                  transition: 'opacity 0.3s ease-in-out',
                }
              }}
            >
              <Box sx={{ p: 3 }}>
                <Box sx={{ 
                  position: 'relative',
                  mb: 4,
                  pb: 2,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: -24,
                    right: -24,
                    height: '1px',
                    background: `linear-gradient(90deg, 
                      ${alpha(theme.palette.divider, 0)}, 
                      ${alpha(theme.palette.divider, 0.1)} 50%,
                      ${alpha(theme.palette.divider, 0)}
                    )`,
                  }
                }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2.5,
                  }}>
                    <Box
                      className="vehicle-icon"
                      sx={{
                        width: 72,
                        height: 72,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '20px',
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.primary.main, 0.04)})`,
                        backdropFilter: 'blur(8px)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          inset: -1,
                          borderRadius: '21px',
                          padding: '1px',
                          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.primary.main, 0.05)})`,
                          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor',
                          maskComposite: 'exclude',
                        }
                      }}
                    >
                      <DirectionsCarIcon 
                        sx={{ 
                          fontSize: 36,
                          color: theme.palette.primary.main,
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                        }} 
                      />
                    </Box>
                    <Box sx={{ flex: 1, pt: 1 }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 700,
                          color: theme.palette.text.primary,
                          mb: 1,
                          letterSpacing: '-0.02em'
                        }}
                      >
                        {vehicle.brand} {vehicle.model}
                      </Typography>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Chip
                          label={vehicle.year}
                          size="small"
                          icon={<CalendarTodayIcon sx={{ fontSize: '1rem !important' }} />}
                          sx={{
                            height: 28,
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            '& .MuiChip-icon': {
                              color: theme.palette.primary.main,
                            },
                          }}
                        />
                        <Badge
                          badgeContent={vehicle.engineSize}
                          max={999}
                          color="primary"
                          sx={{
                            '& .MuiBadge-badge': {
                              height: 28,
                              minWidth: 28,
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '0 8px',
                              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                              '&::after': {
                                content: '"L"',
                                marginLeft: '2px',
                                fontSize: '0.65rem',
                              }
                            }
                          }}
                        >
                          <Box sx={{ width: 8 }} />
                        </Badge>
                      </Stack>
                    </Box>
                  </Box>
                </Box>

                <Stack spacing={3}>
                  <Stack direction="row" spacing={2}>
                    <Tooltip title="Transmisión" placement="top">
                      <Chip
                        icon={<SettingsIcon sx={{ fontSize: '1.1rem' }} />}
                        label={vehicle.transmission}
                        size="small"
                        sx={{
                          height: 32,
                          backgroundColor: alpha(theme.palette.info.main, 0.08),
                          color: theme.palette.info.main,
                          fontWeight: 600,
                          '& .MuiChip-icon': {
                            color: theme.palette.info.main,
                          },
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.info.main, 0.12),
                            transform: 'translateY(-1px)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Tipo de Combustible" placement="top">
                      <Chip
                        icon={<LocalGasStationIcon sx={{ fontSize: '1.1rem' }} />}
                        label={vehicle.fuelType}
                        size="small"
                        sx={{
                          height: 32,
                          backgroundColor: alpha(theme.palette.warning.main, 0.08),
                          color: theme.palette.warning.main,
                          fontWeight: 600,
                          '& .MuiChip-icon': {
                            color: theme.palette.warning.main,
                          },
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.warning.main, 0.12),
                            transform: 'translateY(-1px)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      />
                    </Tooltip>
                  </Stack>

                  <Box sx={{ 
                    position: 'relative',
                    backgroundColor: alpha(theme.palette.background.default, 0.4),
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    p: 2.5,
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '20px',
                      padding: '1px',
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.primary.main, 0.04)})`,
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    }
                  }}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      mb: 2.5
                    }}>
                      <SpeedIcon sx={{ 
                        color: theme.palette.primary.main,
                        fontSize: 24,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                      }} />
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 700,
                          color: theme.palette.text.primary,
                          letterSpacing: '-0.01em'
                        }}
                      >
                        Consumo Promedio
                      </Typography>
                    </Box>
                    {typeof vehicle.consumption === 'object' && (
                      <Stack spacing={2}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: alpha(theme.palette.text.primary, 0.7),
                              fontWeight: 500
                            }}
                          >
                            Ciudad
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress
                              variant="determinate"
                              value={Math.min((vehicle.consumption.city / 15) * 100, 100)}
                              size={24}
                              thickness={4}
                              sx={{
                                color: theme.palette.primary.main,
                                '& .MuiCircularProgress-circle': {
                                  strokeLinecap: 'round',
                                },
                              }}
                            />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: theme.palette.primary.main,
                                fontWeight: 700
                              }}
                            >
                              {vehicle.consumption.city}L/100km
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: alpha(theme.palette.text.primary, 0.7),
                              fontWeight: 500
                            }}
                          >
                            Carretera
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress
                              variant="determinate"
                              value={Math.min((vehicle.consumption.highway / 15) * 100, 100)}
                              size={24}
                              thickness={4}
                              sx={{
                                color: theme.palette.success.main,
                                '& .MuiCircularProgress-circle': {
                                  strokeLinecap: 'round',
                                },
                              }}
                            />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: theme.palette.success.main,
                                fontWeight: 700
                              }}
                            >
                              {vehicle.consumption.highway}L/100km
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: alpha(theme.palette.text.primary, 0.7),
                              fontWeight: 500
                            }}
                          >
                            Mixto
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress
                              variant="determinate"
                              value={Math.min((vehicle.consumption.mixed / 15) * 100, 100)}
                              size={24}
                              thickness={4}
                              sx={{
                                color: theme.palette.warning.main,
                                '& .MuiCircularProgress-circle': {
                                  strokeLinecap: 'round',
                                },
                              }}
                            />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: theme.palette.warning.main,
                                fontWeight: 700
                              }}
                            >
                              {vehicle.consumption.mixed}L/100km
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    )}
                  </Box>
                </Stack>

                <Stack 
                  direction="row" 
                  spacing={1.5} 
                  className="card-actions"
                  sx={{ 
                    mt: 3,
                    pt: 3,
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    opacity: { xs: 1, md: 0 },
                    transform: { xs: 'none', md: 'translateY(10px)' },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <Tooltip title="Editar vehículo" placement="top">
                    <IconButton
                      onClick={() => handleEditVehicle(vehicle)}
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: '12px',
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.main,
                          color: 'white',
                          transform: 'translateY(-2px)',
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <EditIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar vehículo" placement="top">
                    <IconButton
                      onClick={() => vehicle._id && handleDelete(vehicle._id)}
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: '12px',
                        backgroundColor: alpha(theme.palette.error.main, 0.08),
                        color: theme.palette.error.main,
                        '&:hover': {
                          backgroundColor: theme.palette.error.main,
                          color: 'white',
                          transform: 'translateY(-2px)',
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
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
      </Container>
    </Box>
  );
};

export default Vehicles; 