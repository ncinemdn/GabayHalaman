using ProjectName.Models;
using ProjectName.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Services
{
	public class RequestPlantService
	{
		public RequestPlantService()
		{

		}

		public IEnumerable<RequestPlant> GetAll()
		{
			RequestPlantRepository requestplantRepository = new RequestPlantRepository();
			return requestplantRepository.GetAll();
		}

		public RequestPlant GetById(int id)
		{
			RequestPlantRepository requestplantRepository = new RequestPlantRepository();
			return requestplantRepository.GetbyId(id);
		}
		public bool Add(RequestPlant rp)
		{
			RequestPlantRepository requestplantRepository = new RequestPlantRepository();
			return requestplantRepository.Add(rp);
		}

		public bool Delete(int id)
		{
			RequestPlantRepository requestplantRepository = new RequestPlantRepository();
			return requestplantRepository.Delete(id);
		}
		public bool Updatet(RequestPlant rp)
		{
			RequestPlantRepository requestplantRepository = new RequestPlantRepository();
			return requestplantRepository.Update(rp);
		}


	}
}
