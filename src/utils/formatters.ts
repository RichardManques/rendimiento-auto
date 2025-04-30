import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formats a date to a user-friendly string in Spanish
 * @param date - The date to format
 * @returns Formatted date string (e.g., "15 de marzo de 2024")
 */
export const formatDate = (date: Date | string | number): string => {
  const dateObj = new Date(date);
  return format(dateObj, "d 'de' MMMM 'de' yyyy", { locale: es });
};

/**
 * Formats a date to a short version
 * @param date - The date to format
 * @returns Short formatted date string (e.g., "15/03/2024")
 */
export const formatShortDate = (date: Date | string | number): string => {
  const dateObj = new Date(date);
  return format(dateObj, 'dd/MM/yyyy');
};

/**
 * Formats a number as currency in Argentine Pesos (ARS)
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$ 49.990")
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a number with thousand separators
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string (e.g., "1.234")
 */
export const formatNumber = (value: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Formats a fuel quantity with L suffix
 * @param liters - The quantity in liters
 * @returns Formatted fuel quantity string (e.g., "45.5 L")
 */
export const formatFuelQuantity = (liters: number): string => {
  return `${formatNumber(liters, 1)} L`;
};

/**
 * Formats a number as a percentage
 * @param value - The value to format as percentage
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string (e.g., "85.5%")
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${formatNumber(value, decimals)}%`;
};

/**
 * Formats a distance with km suffix
 * @param kilometers - The distance in kilometers
 * @returns Formatted distance string (e.g., "1,234 km")
 */
export const formatDistance = (kilometers: number): string => {
  return `${formatNumber(kilometers)} km`;
};

/**
 * Formats speed with km/h suffix
 * @param speed - The speed in kilometers per hour
 * @returns Formatted speed string (e.g., "120 km/h")
 */
export const formatSpeed = (speed: number): string => {
  return `${formatNumber(speed)} km/h`;
};

/**
 * Formats efficiency in kilometers per liter
 * @param kmPerLiter - The efficiency in kilometers per liter
 * @returns Formatted efficiency string (e.g., "12.5 km/L")
 */
export const formatEfficiency = (kmPerLiter: number): string => {
  return `${formatNumber(kmPerLiter, 1)} km/L`;
}; 