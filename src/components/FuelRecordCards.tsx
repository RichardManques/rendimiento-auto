import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Container,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import OpacityIcon from '@mui/icons-material/Opacity';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { FuelRecord } from '../types';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface FuelRecordCardsProps {
  records: FuelRecord[];
  onDelete: (id: string) => void;
}

const FuelRecordCards: React.FC<FuelRecordCardsProps> = ({ records, onDelete }) => {
  const theme = useTheme();

  const formatDate = (date: Date) => {
    const distanceString = formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: es 
    });
    
    const fullDate = format(new Date(date), "d 'de' MMMM 'de' yyyy, HH:mm", { 
      locale: es 
    });

    return {
      relative: distanceString,
      full: fullDate
    };
  };

  if (!records || records.length === 0) {
    return (
      <Card 
        elevation={0} 
        sx={{ 
          p: 8,
          mt: 6,
          textAlign: 'center',
          background: `linear-gradient(165deg, ${alpha(theme.palette.background.paper, 0.98)}, ${alpha(theme.palette.background.paper, 0.94)})`,
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
          boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.06)}`,
        }}
      >
        <Box sx={{
          width: 80,
          height: 80,
          margin: '0 auto',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20px',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.primary.main, 0.04)})`,
        }}>
          <LocalGasStationIcon sx={{ 
            fontSize: 36,
            color: theme.palette.primary.main,
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))'
          }} />
        </Box>
        <Typography variant="h5" sx={{ 
          mb: 1.5,
          fontWeight: 700,
          background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${alpha(theme.palette.text.primary, 0.7)})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em'
        }}>
          No hay registros disponibles
        </Typography>
        <Typography variant="body1" sx={{ 
          color: alpha(theme.palette.text.primary, 0.6),
          maxWidth: 400,
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Los registros de tus recargas de combustible aparecerán aquí una vez que comiences a agregarlos
        </Typography>
      </Card>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(3, 1fr)'
            },
            gap: 3,
            width: '100%'
          }}
        >
          {records.map((record) => (
            <Card
              key={record._id}
              sx={{
                position: 'relative',
                borderRadius: '24px',
                background: `linear-gradient(145deg, 
                  ${alpha(theme.palette.background.paper, 0.9)},
                  ${alpha(theme.palette.background.paper, 0.95)}
                )`,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                boxShadow: `0 4px 24px ${alpha(theme.palette.common.black, 0.04)}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'visible',
                '&:hover': {
                  transform: 'translateY(-4px) scale(1.01)',
                  boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.08)}`,
                  '& .actions': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  }
                },
              }}
            >
              {/* Header con fecha y acciones */}
              <Box sx={{ 
                p: 2.5,
                pb: 0,
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{
                    width: 42,
                    height: 42,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.main, 0.05)})`,
                  }}>
                    <LocalGasStationIcon sx={{ 
                      fontSize: 24,
                      color: theme.palette.primary.main,
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      letterSpacing: '-0.01em'
                    }}>
                      {record.gasStation}
                    </Typography>
                    <Typography variant="body2" sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      color: alpha(theme.palette.text.primary, 0.6),
                      fontWeight: 500
                    }}>
                      <LocationOnIcon sx={{ fontSize: 14 }} />
                      {record.location}
                    </Typography>
                  </Box>
                </Box>
                <Box className="actions" sx={{
                  opacity: { xs: 1, md: 0 },
                  transform: { xs: 'none', md: 'translateY(10px)' },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  <Tooltip title="Eliminar registro">
                    <IconButton
                      onClick={() => record._id && onDelete(record._id)}
                      size="small"
                      sx={{
                        backgroundColor: alpha(theme.palette.error.main, 0.08),
                        color: theme.palette.error.main,
                        borderRadius: '10px',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.error.main, 0.12),
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <CardContent sx={{ pt: 2.5 }}>
                <Stack spacing={2}>
                  {/* Fecha */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1
                  }}>
                    <CalendarTodayIcon sx={{ 
                      fontSize: 16,
                      color: alpha(theme.palette.text.primary, 0.4)
                    }} />
                    <Tooltip title={formatDate(record.date).full}>
                      <Typography variant="body2" sx={{
                        color: alpha(theme.palette.text.primary, 0.6),
                        fontWeight: 500
                      }}>
                        {formatDate(record.date).relative}
                      </Typography>
                    </Tooltip>
                  </Box>

                  <Divider sx={{ 
                    opacity: 0.06,
                    mx: -2.5
                  }} />

                  {/* Grid de datos principales */}
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 2.5,
                    pt: 1
                  }}>
                    {/* Litros */}
                    <Box sx={{
                      p: 1.5,
                      borderRadius: '16px',
                      background: `linear-gradient(145deg, ${alpha(theme.palette.info.main, 0.08)}, ${alpha(theme.palette.info.main, 0.04)})`,
                    }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        <OpacityIcon sx={{ 
                          fontSize: 18,
                          color: theme.palette.info.main,
                          opacity: 0.8
                        }} />
                        <Typography variant="caption" sx={{
                          color: alpha(theme.palette.info.main, 0.8),
                          fontWeight: 600
                        }}>
                          Litros
                        </Typography>
                      </Stack>
                      <Typography variant="h6" sx={{
                        color: theme.palette.info.main,
                        fontWeight: 700,
                        letterSpacing: '-0.02em'
                      }}>
                        {formatNumber(record.liters, 1)}L
                      </Typography>
                    </Box>

                    {/* Precio por litro */}
                    <Box sx={{
                      p: 1.5,
                      borderRadius: '16px',
                      background: `linear-gradient(145deg, ${alpha(theme.palette.warning.main, 0.08)}, ${alpha(theme.palette.warning.main, 0.04)})`,
                    }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        <AttachMoneyIcon sx={{ 
                          fontSize: 18,
                          color: theme.palette.warning.main,
                          opacity: 0.8
                        }} />
                        <Typography variant="caption" sx={{
                          color: alpha(theme.palette.warning.main, 0.8),
                          fontWeight: 600
                        }}>
                          Precio/L
                        </Typography>
                      </Stack>
                      <Typography variant="h6" sx={{
                        color: theme.palette.warning.main,
                        fontWeight: 700,
                        letterSpacing: '-0.02em'
                      }}>
                        {formatCurrency(record.pricePerLiter)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Total */}
                  <Box sx={{
                    mt: 1,
                    p: 2,
                    borderRadius: '16px',
                    background: `linear-gradient(145deg, ${alpha(theme.palette.success.main, 0.08)}, ${alpha(theme.palette.success.main, 0.04)})`,
                  }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <ReceiptLongIcon sx={{ 
                        fontSize: 20,
                        color: theme.palette.success.main,
                        opacity: 0.8
                      }} />
                      <Typography variant="caption" sx={{
                        color: alpha(theme.palette.success.main, 0.8),
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Total
                      </Typography>
                    </Stack>
                    <Typography variant="h5" sx={{
                      fontWeight: 700,
                      color: theme.palette.success.main,
                      letterSpacing: '-0.02em'
                    }}>
                      {formatCurrency(record.totalCost)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FuelRecordCards;