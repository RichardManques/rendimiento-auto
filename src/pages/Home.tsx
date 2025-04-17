import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  IconButton,
  Card,
  CardContent,
  useTheme,
  Stack,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import TimelineIcon from '@mui/icons-material/Timeline';
import { FuelRecord } from '../types';
import { fuelService } from '../services/api';
import FuelRecordList from '../components/FuelRecordList';
import NewRecordModal from '../components/NewRecordModal';

const RecentRecords: React.FC = () => {
  const theme = useTheme();
  const [records, setRecords] = useState<FuelRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadRecentRecords();
  }, []);

  const loadRecentRecords = async () => {
    try {
      const records = await fuelService.getAllRecords();
      const recentRecords = records
        .sort((a: FuelRecord, b: FuelRecord) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      setRecords(recentRecords);
    } catch (error) {
      console.error('Error loading recent records:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fuelService.deleteRecord(id);
      loadRecentRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleSubmit = async (record: Omit<FuelRecord, '_id' | 'userId'>) => {
    try {
      await fuelService.createRecord(record);
      loadRecentRecords();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating record:', error);
    }
  };

  const calculateStats = () => {
    if (records.length === 0) return { totalMonth: 0, avgPrice: 0, trend: 0 };
    
    const totalMonth = records.reduce((sum, record) => sum + record.totalCost, 0);
    const avgPrice = records.reduce((sum, record) => sum + record.pricePerLiter, 0) / records.length;
    const trend = records.length > 1 ? 
      ((records[0].pricePerLiter - records[records.length-1].pricePerLiter) / records[records.length-1].pricePerLiter) * 100 
      : 0;

    return { totalMonth, avgPrice, trend };
  };

  const stats = calculateStats();

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)',
      py: 4,
      px: { xs: 2, md: 4 },
      bgcolor: 'background.default'
    }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                Dashboard de Combustible
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Resumen de tus últimos registros de combustible
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsModalOpen(true)}
              sx={{ 
                borderRadius: 2,
                py: 1.5,
                px: 3,
                boxShadow: theme.shadows[2]
              }}
            >
              Nuevo Registro
            </Button>
          </Box>

          {/* Stats Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            <Card 
              sx={{ 
                bgcolor: 'primary.main',
                color: 'white',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
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
                <LocalGasStationIcon sx={{ fontSize: 150 }} />
              </Box>
              <CardContent sx={{ position: 'relative', height: '100%' }}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                    Gasto Total del Mes
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    ${stats.totalMonth.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    Últimos 30 días
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card 
              sx={{ 
                bgcolor: 'secondary.main',
                color: 'white',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
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
                <TimelineIcon sx={{ fontSize: 150 }} />
              </Box>
              <CardContent sx={{ position: 'relative', height: '100%' }}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                    Precio Promedio
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    ${stats.avgPrice.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    Por litro
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card 
              sx={{ 
                bgcolor: stats.trend > 0 ? '#f44336' : '#4caf50',
                color: 'white',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
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
                {stats.trend > 0 ? 
                  <TrendingUpIcon sx={{ fontSize: 150 }} /> : 
                  <TrendingDownIcon sx={{ fontSize: 150 }} />
                }
              </Box>
              <CardContent sx={{ position: 'relative', height: '100%' }}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                    Tendencia de Precios
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {stats.trend.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    {stats.trend > 0 ? 'Incremento' : 'Reducción'} vs último registro
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Recent Records */}
          <Paper 
            sx={{ 
              p: 3,
              borderRadius: 3,
              boxShadow: theme.shadows[2]
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Últimos Registros
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Los 5 registros más recientes de tus cargas de combustible
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <FuelRecordList records={records} onDelete={handleDelete} />
          </Paper>
        </Stack>

        <NewRecordModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </Container>
    </Box>
  );
};

export default RecentRecords; 