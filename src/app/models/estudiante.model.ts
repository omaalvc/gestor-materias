export interface Estudiante {
  id?: number;
  nombre: string;
  email: string;
  registros?: Registro[];
}

export interface Registro {
  id?: number;
  estudianteId: number;
  materiaId: number;
  materia?: Materia;
}

export interface Materia {
  id?: number;
  nombre: string;
  descripcion: string;
  creditos: number;
  profesor?: any;
}