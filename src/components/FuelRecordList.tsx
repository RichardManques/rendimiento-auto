import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Tooltip,
  Box,
  useTheme,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { FuelRecord } from '../types';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';

interface FuelRecordListProps {
  records: FuelRecord[];
  onDelete: (id: string) => void;
}

const FuelRecordList: React.FC<FuelRecordListProps> = ({ records, onDelete }) => {
  const theme = useTheme();

  const formatDate = (date: Date) => {
    const distanceString = formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: es 
    });
    
    const fullDate = format(new Date(date), "d 'de' MMMM 'de' yyyy, HH:mm", { 
      locale: es 
    });

    return (
      <Tooltip title={fullDate} placement="top">
        <Chip
          label={distanceString}
          size="small"
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
            },
          }}
        />
      </Tooltip>
    );
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
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(number);
  };

  if (!records || records.length === 0) {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4,
          mt: 4,
          textAlign: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          borderRadius: 3
        }}
      >
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          No hay registros disponibles
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Los registros de tus recargas aparecerán aquí
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        mt: 4,
        backgroundColor: 'transparent'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3,
        gap: 1
      }}>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary
          }}
        >
          Historial de Cargas
        </Typography>
        <Chip
          label={records.length}
          size="small"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            fontWeight: 600
          }}
        />
      </Box>
      
      <TableContainer 
        component={Paper} 
        elevation={0}
        sx={{ 
          borderRadius: 3,
          backgroundColor: 'white',
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Estación</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Precio/Litro</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Litros</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2, width: 80 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow 
                key={record._id}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  },
                  transition: 'background-color 0.2s ease'
                }}
              >
                <TableCell sx={{ py: 2 }}>{formatDate(record.date)}</TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalGasStationIcon 
                      sx={{ 
                        color: theme.palette.primary.main,
                        fontSize: 20
                      }} 
                    />
                    <Box>
                      <Typography variant="body2">
                        {record.gasStation}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: 'text.secondary'
                        }}
                      >
                        <LocationOnIcon sx={{ fontSize: 14 }} />
                        {record.location}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatCurrency(record.pricePerLiter)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Typography variant="body2">
                    {formatNumber(record.liters)}L
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme => theme.palette.success.main
                    }}
                  >
                    {formatCurrency(record.totalCost)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Tooltip title="Eliminar registro">
                    <IconButton
                      onClick={() => record._id && onDelete(record._id)}
                      size="small"
                      sx={{ 
                        color: theme.palette.error.main,
                        '&:hover': {
                          backgroundColor: `${theme.palette.error.main}10`
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default FuelRecordList; 