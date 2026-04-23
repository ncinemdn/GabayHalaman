using ProjectName.Models;
using ProjectName.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Services
{
	public class PlantSizeService
	{
		public PlantSizeService()
		{

		}

		public IEnumerable<PlantSize> GetAll()
		{
			PlantSizeRepository plantsizeRepository = new PlantSizeRepository();
			return plantsizeRepository.GetAll();
		}

		public PlantSize GetById(int id)
		{
			PlantSizeRepository plantsizeRepository = new PlantSizeRepository();
			return plantsizeRepository.GetbyId(id);
		}
		public bool Add(PlantSize ps)
		{
			PlantSizeRepository plantsizeRepository = new PlantSizeRepository();
			return plantsizeRepository.Add(ps);
		}

		public bool Delete(int id)
		{
			PlantSizeRepository plantsizeRepository = new PlantSizeRepository();
			return plantsizeRepository.Delete(id);
		}
		public bool Updatet(PlantSize ps)
		{
			PlantSizeRepository plantsizeRepository = new PlantSizeRepository();
			return plantsizeRepository.Update(ps);
		}


	}
}
