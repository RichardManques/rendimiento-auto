import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

interface VehicleData {
  brand: string;
  model: string;
  year: number;
  fuelType: 'gasolina' | 'diesel' | 'híbrido' | 'eléctrico';
  transmission: 'manual' | 'automático';
  engineSize: number;
}

const VehicleRegistration = () => {
  const navigate = useNavigate();
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    fuelType: 'gasolina',
    transmission: 'manual',
    engineSize: 0,
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        throw new Error('Error al registrar el vehículo');
      }

      navigate('/rendimiento');
    } catch (error) {
      setError('Error al registrar el vehículo. Por favor, intenta nuevamente.');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Registro de Vehículo
        </Typography>
        <Typography variant="body1" paragraph>
          Registra tu vehículo para obtener cálculos más precisos de rendimiento.
        </Typography>

        <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
            <Box sx={{ flex: '1 1 calc(50% - 24px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Marca"
                value={vehicleData.brand}
                onChange={(e) => setVehicleData({ ...vehicleData, brand: e.target.value })}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 24px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Modelo"
                value={vehicleData.model}
                onChange={(e) => setVehicleData({ ...vehicleData, model: e.target.value })}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 24px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Año"
                type="number"
                value={vehicleData.year}
                onChange={(e) => setVehicleData({ ...vehicleData, year: Number(e.target.value) })}
                required
                inputProps={{ min: 1900, max: new Date().getFullYear() }}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 24px)', minWidth: '250px' }}>
              <FormControl fullWidth required>
                <InputLabel>Tipo de Combustible</InputLabel>
                <Select
                  value={vehicleData.fuelType}
                  onChange={(e) => setVehicleData({ ...vehicleData, fuelType: e.target.value as VehicleData['fuelType'] })}
                  label="Tipo de Combustible"
                >
                  <MenuItem value="gasolina">Gasolina</MenuItem>
                  <MenuItem value="diesel">Diesel</MenuItem>
                  <MenuItem value="híbrido">Híbrido</MenuItem>
                  <MenuItem value="eléctrico">Eléctrico</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 24px)', minWidth: '250px' }}>
              <FormControl fullWidth required>
                <InputLabel>Transmisión</InputLabel>
                <Select
                  value={vehicleData.transmission}
                  onChange={(e) => setVehicleData({ ...vehicleData, transmission: e.target.value as VehicleData['transmission'] })}
                  label="Transmisión"
                >
                  <MenuItem value="manual">Manual</MenuItem>
                  <MenuItem value="automático">Automático</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 24px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Cilindrada (cc)"
                type="number"
                value={vehicleData.engineSize}
                onChange={(e) => setVehicleData({ ...vehicleData, engineSize: Number(e.target.value) })}
                required
                inputProps={{ min: 0 }}
              />
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              Registrar Vehículo
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default VehicleRegistration; 