import React, { useEffect, useState, ReactNode } from 'react';
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
  Divider,
  alpha,
  SvgIconTypeMap,
} from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import TimelineIcon from '@mui/icons-material/Timeline';
import SpeedIcon from '@mui/icons-material/Speed';
import { FuelRecord } from '../types';
import { fuelService } from '../services/api';
import FuelRecordCards from '../components/FuelRecordCards';
import NewRecordModal from '../components/NewRecordModal';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface StyledCardProps {
  children: ReactNode;
  color?: string;
  icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> | null;
  [key: string]: any;
}

const StyledCard = ({ children, color = 'primary.main', icon: Icon, ...props }: StyledCardProps) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${alpha(color, 0.95)}, ${alpha(color, 0.85)})`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        boxShadow: `0 10px 30px -10px ${alpha(color, 0.3)}`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 20px 40px -15px ${alpha(color, 0.4)}`,
        },
        ...props.sx,
      }}
      {...props}
    >
      <Box
        sx={{
          position: 'absolute',
          right: -20,
          top: -20,
          opacity: 0.1,
          transform: 'rotate(25deg)',
        }}
      >
        {Icon && <Icon sx={{ fontSize: 150 }} />}
      </Box>
      <CardContent sx={{ position: 'relative', height: '100%', color: 'white' }}>
        {children}
      </CardContent>
    </Card>
  );
};

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
        .slice(0, 6);
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

  const chartData = records
    .slice()
    .reverse()
    .map((record) => ({
      date: new Date(record.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      precio: record.pricePerLiter,
      costo: record.totalCost,
      litros: record.liters,
    }));

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        py: 4,
        px: { xs: 2, md: 4 },
        bgcolor: 'background.default',
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.95)}, ${alpha(
          theme.palette.background.default,
          0.9
        )}), url('/path/to/subtle-pattern.png')`,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
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
                borderRadius: '12px',
                py: 1.5,
                px: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 8px 20px -6px ${alpha(theme.palette.primary.main, 0.4)}`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 24px -8px ${alpha(theme.palette.primary.main, 0.5)}`,
                },
              }}
            >
              Nuevo Registro
            </Button>
          </Box>

          {/* Stats Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            <StyledCard color={theme.palette.primary.main} icon={LocalGasStationIcon}>
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
            </StyledCard>

            <StyledCard color={theme.palette.secondary.main} icon={TimelineIcon}>
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
            </StyledCard>

            <StyledCard
              color={stats.trend > 0 ? '#f44336' : '#4caf50'}
              icon={stats.trend > 0 ? TrendingUpIcon : TrendingDownIcon}
            >
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
            </StyledCard>
          </Box>

          {/* Chart Section */}
          <Paper
            sx={{
              p: 3,
              borderRadius: '24px',
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(
                theme.palette.background.paper,
                0.8
              )})`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Análisis de Consumo
            </Typography>
            <Box sx={{ height: 300, width: '100%' }}>
              <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: theme.palette.text.secondary }}
                    stroke={theme.palette.divider}
                  />
                  <YAxis tick={{ fill: theme.palette.text.secondary }} stroke={theme.palette.divider} />
                  <Tooltip
                    contentStyle={{
                      background: alpha(theme.palette.background.paper, 0.9),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      borderRadius: '8px',
                      boxShadow: theme.shadows[3],
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="precio"
                    stroke={theme.palette.primary.main}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                  />
                  <Area
                    type="monotone"
                    dataKey="costo"
                    stroke={theme.palette.secondary.main}
                    fillOpacity={1}
                    fill="url(#colorCost)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          {/* Recent Records */}
          <Paper
            sx={{
              p: 3,
              borderRadius: '24px',
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(
                theme.palette.background.paper,
                0.8
              )})`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`,
            }}
          >
            <FuelRecordCards records={records} onDelete={handleDelete} />
          </Paper>
        </Stack>

        <NewRecordModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />
      </Container>
    </Box>
  );
};

export default RecentRecords; 