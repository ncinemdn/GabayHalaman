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
	public class RequestController : Controller
	{
		RequestService requestServices = new RequestService();
		private readonly string _connectionString = "Server=localhost;Database=GabayHalamanDB;Trusted_Connection=True;"; // Update with your connection string

		[HttpGet]
		public ActionResult GetAll()
		{
			var book = requestServices.GetAll();
			return Ok(book);
		}

		[HttpGet("{id}")]
		public Request GetById(int id)
		{
			return requestServices.GetById(id);
		}

		[HttpPost]
		public bool Add(Request rq)
		{
			return requestServices.Add(rq);
		}

		[HttpPut]
		public bool Update(Request rq)
		{
			return requestServices.Updatet(rq);
		}

		[HttpDelete]
		public bool Delete(int id)
		{
			return requestServices.Delete(id);
		}

		// SP3: ComputeTotalAmount
		[HttpGet("total-amount/{requestId}")]
		public async Task<IActionResult> ComputeTotalAmount(int requestId)
		{
			using (var connection = new SqlConnection(_connectionString))
			{
				var parameters = new { request_id = requestId };
				var result = await connection.QueryFirstOrDefaultAsync("SP_ComputeTotalAmount", parameters, commandType: CommandType.StoredProcedure);
				return Ok(result);
			}
		}

		// SP4: SortGroupPlantRequested
		[HttpGet("plant-requested")]
		public async Task<IActionResult> SortGroupPlantRequested()
		{
			using (var connection = new SqlConnection(_connectionString))
			{
				var result = await connection.QueryAsync("SP_SortGroupPlantRequested", commandType: CommandType.StoredProcedure);
				return Ok(result);
			}
		}
	}
}
