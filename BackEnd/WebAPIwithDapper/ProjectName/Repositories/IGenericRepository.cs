using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Repositories
{
    public interface IGenericRepository<T> where T:class
    {
        IEnumerable<T> GetAll();
        T GetbyId(int id);
        bool Add(T Entity);
        bool Update(T Entity);
        bool Delete(int id);

    }
}
