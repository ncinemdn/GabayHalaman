using Microsoft.AspNetCore.Mvc;
using ProjectName.Models;
using ProjectName.Services;
using System.Data.SqlClient;
using System.Data;
using Dapper;

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class PlantController : Controller
	{
		PlantService plantServices = new PlantService();
		private readonly string _connectionString = "Server=localhost;Database=GabayHalamanDB;Trusted_Connection=True;"; // Update with your connection string

		[HttpGet]
		public ActionResult GetAll()
		{
			var book = plantServices.GetAll();
			return Ok(book);
		}

		[HttpGet("{id}")]
		public Plant GetById(int id)
		{
			return plantServices.GetById(id);
		}

		[HttpPost]
public ActionResult<int> Add(Plant p)
	{
		var newPlantId = plantServices.Add(p);
		if (newPlantId <= 0)
		{
			return BadRequest("Failed to create plant.");
		}

		return CreatedAtAction(nameof(GetById), new { id = newPlantId }, newPlantId);
		}

		[HttpPut]
		public bool Update(Plant p)
		{
			return plantServices.Updatet(p);
		}

		[HttpDelete("{id}")]
		public bool Delete(int id)
		{
			return plantServices.Delete(id);
		}

		// SP7: GetPlantTotal
		[HttpGet("total/{plantId}")]
		public async Task<IActionResult> GetPlantTotal(int plantId)
		{
			using (var connection = new SqlConnection(_connectionString))
			{
				var parameters = new { plant_id = plantId };
				var result = await connection.QueryFirstOrDefaultAsync("SP_GetPlantTotal", parameters, commandType: CommandType.StoredProcedure);
				return Ok(result);
			}
		}

		// SP9: GetPopularPlants
		[HttpGet("popular/{minQuantity}")]
		public async Task<IActionResult> GetPopularPlants(int minQuantity)
		{
			using (var connection = new SqlConnection(_connectionString))
			{
				var parameters = new { min_quantity = minQuantity };
				var result = await connection.QueryAsync("SP_GetPopularPlants", parameters, commandType: CommandType.StoredProcedure);
				return Ok(result);
			}
		}
	}
}
