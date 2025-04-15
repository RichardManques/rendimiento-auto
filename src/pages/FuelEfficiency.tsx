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
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SaveIcon from '@mui/icons-material/Save';

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
  const [tripData, setTripData] = useState<TripRecord>({
    userId: '',
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

  const calculateEfficiency = () => {
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
      const response = await fetch('/api/efficiency/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData)
      });

      if (!response.ok) {
        throw new Error('Error al guardar el registro');
      }

      const savedRecord = await response.json();
      console.log('Registro guardado:', savedRecord);
    } catch (error) {
      console.error('Error al guardar:', error);
      setError('Error al guardar el registro');
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

        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 calc(50% - 24px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Kilómetros Iniciales"
                type="number"
                value={tripData.startKm}
                onChange={(e) => setTripData({ ...tripData, startKm: Number(e.target.value) })}
                InputProps={{
                  endAdornment: <Typography color="textSecondary">km</Typography>
                }}
                helperText="Kilómetros disponibles al inicio del viaje"
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 24px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Kilómetros Finales"
                type="number"
                value={tripData.endKm}
                onChange={(e) => setTripData({ ...tripData, endKm: Number(e.target.value) })}
                InputProps={{
                  endAdornment: <Typography color="textSecondary">km</Typography>
                }}
                helperText="Kilómetros disponibles al final del viaje"
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 24px)', minWidth: '250px' }}>
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
                <FormHelperText>Cómo conduces habitualmente</FormHelperText>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 24px)', minWidth: '250px' }}>
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
                <FormHelperText>Tipo de ruta principal</FormHelperText>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 24px)', minWidth: '250px' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={tripData.useAC}
                    onChange={(e) => setTripData({ ...tripData, useAC: e.target.checked })}
                  />
                }
                label="Uso de Aire Acondicionado"
              />
            </Box>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="contained"
              onClick={calculateEfficiency}
              startIcon={<DirectionsCarIcon />}
            >
              Calcular Rendimiento
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={saveRecord}
              startIcon={<SaveIcon />}
              disabled={!efficiency}
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 calc(33.333% - 24px)', minWidth: '250px' }}>
              <Card>
                <CardContent>
                  <Stack spacing={2} alignItems="center">
                    <DirectionsCarIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Typography variant="h6" align="center">
                      Rendimiento Base vs Real
                    </Typography>
                    <Typography variant="h4" align="center" color="primary">
                      {efficiency.baseEfficiency} → {efficiency.adjustedEfficiency} km/L
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rendimiento ajustado según tu estilo
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 calc(33.333% - 24px)', minWidth: '250px' }}>
              <Card>
                <CardContent>
                  <Stack spacing={2} alignItems="center">
                    <AttachMoneyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Typography variant="h6" align="center">
                      Costo por Kilómetro
                    </Typography>
                    <Typography variant="h4" align="center" color="primary">
                      {formatCurrency(efficiency.costPerKm)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Basado en rendimiento real
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 calc(33.333% - 24px)', minWidth: '250px' }}>
              <Card>
                <CardContent>
                  <Stack spacing={2} alignItems="center">
                    <LocalGasStationIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Typography variant="h6" align="center">
                      Resumen del Viaje
                    </Typography>
                    <Typography variant="h4" align="center" color="primary">
                      {formatCurrency(efficiency.tripCost)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {efficiency.kmConsumed} km recorridos
                    </Typography>
                  </Stack>
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