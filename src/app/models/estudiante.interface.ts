export interface Estudiante {
  id?: string;
  nombre: string;
  apellidos: string;
  email: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: Date;
  materias?: any[];
}