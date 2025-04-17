import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
  Container,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SettingsIcon from '@mui/icons-material/Settings';
import SpeedIcon from '@mui/icons-material/Speed';
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
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Mis Vehículos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2 }}
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
                borderRadius: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              {vehicle.isDefault && (
                <Chip
                  label="Principal"
                  color="primary"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    fontWeight: 600
                  }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <DirectionsCarIcon color="primary" />
                  <Typography variant="h6" component="div">
                    {vehicle.brand} {vehicle.model}
                  </Typography>
                </Box>

                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 2
                }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <SpeedIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                      Año: {vehicle.year}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <SettingsIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                      {vehicle.transmission}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <LocalGasStationIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                      {vehicle.fuelType}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Motor: {vehicle.engineSize}L
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                    Consumo:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
                    {typeof vehicle.consumption === 'object' ? (
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Ciudad: {vehicle.consumption.city}L/100km
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Carretera: {vehicle.consumption.highway}L/100km
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Mixto: {vehicle.consumption.mixed}L/100km
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Promedio: {vehicle.consumption}L/100km
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                <Tooltip title="Editar">
                  <IconButton 
                    size="small" 
                    onClick={() => handleEditVehicle(vehicle)}
                    sx={{ 
                      color: theme.palette.primary.main,
                      '&:hover': { backgroundColor: `${theme.palette.primary.main}10` }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton 
                    size="small"
                    onClick={() => vehicle._id && handleDelete(vehicle._id)}
                    sx={{ 
                      color: theme.palette.error.main,
                      '&:hover': { backgroundColor: `${theme.palette.error.main}10` }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </CardActions>
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