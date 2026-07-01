// Modelo de tarjeta de estadística
export interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  error: boolean;
}