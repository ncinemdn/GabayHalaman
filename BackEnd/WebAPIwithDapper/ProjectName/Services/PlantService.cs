using ProjectName.Models;
using ProjectName.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Services
{
	public class PlantService
	{
		public PlantService()
		{

		}

		public IEnumerable<Plant> GetAll()
		{
			PlantRepository plantRepository = new PlantRepository();
			return plantRepository.GetAll();
		}

		public Plant GetById(int id)
		{
			PlantRepository plantRepository = new PlantRepository();
			return plantRepository.GetbyId(id);
		}
		public bool Add(Plant p)
		{
			PlantRepository plantRepository = new PlantRepository();
			return plantRepository.Add(p);
		}

		public bool Delete(int id)
		{
			PlantRepository plantRepository = new PlantRepository();
			return plantRepository.Delete(id);
		}
		public bool Updatet(Plant p)
		{
			PlantRepository plantRepository = new PlantRepository();
			return plantRepository.Update(p);
		}


	}
}
