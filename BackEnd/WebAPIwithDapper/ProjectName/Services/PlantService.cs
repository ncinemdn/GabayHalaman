using ProjectName.Models;
using ProjectName.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using Dapper;

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
			Console.WriteLine("Deleting plant ID: " + id);

			using (var connection = new SqlConnection("Server=LAPTOP-21JQHQ4T\\SQLEXPRESS;Database=GabayHalamanDB;Trusted_Connection=True;"))
			{
				var childRows = connection.Execute(
					"DELETE FROM tblPlantSize WHERE plant_id = @Id",
					new { Id = id });

				Console.WriteLine("Deleted child rows: " + childRows);
			}

			PlantRepository plantRepository = new PlantRepository();
			var result = plantRepository.Delete(id);

			Console.WriteLine("Deleted parent: " + result);

			return result;
		}

		public bool Updatet(Plant p)
		{
			var plantRepository = new PlantRepository();

			// 🔥 GET EXISTING RECORD FIRST
			var existing = plantRepository.GetbyId(p.plant_id);

			if (existing == null)
				return false;

			// ✅ PRESERVE created_at
			p.CreatedAt = existing.CreatedAt;

			// ✅ UPDATE timestamp
			p.UpdatedAt = DateTime.Now;

			return plantRepository.Update(p);
		}
	}
}