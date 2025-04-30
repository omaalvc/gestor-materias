using GestorMaterias.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GestorMaterias.Services
{
    public interface IRegistroService
    {
        // Métodos para estudiantes
        Task<EstudianteDTO> GetEstudianteAsync(int id);
        Task<IEnumerable<EstudianteDTO>> GetEstudiantesAsync();
        Task<EstudianteDTO> CreateEstudianteAsync(EstudianteDTO estudiante);
        Task<bool> UpdateEstudianteAsync(EstudianteDTO estudiante);
        Task<bool> DeleteEstudianteAsync(int id);
        
        // Métodos de matrícula
        Task<bool> MatricularEstudianteAsync(int estudianteId, int materiaId);
        Task<bool> CancelarMatriculaAsync(int estudianteId, int materiaId);
        Task<IEnumerable<MateriaDTO>> GetMateriasDeEstudianteAsync(int estudianteId);
    }
}