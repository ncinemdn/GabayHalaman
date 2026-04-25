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

		[HttpPut("status/{id}")]
		public async Task<IActionResult> UpdateStatus(int id, [FromBody] RequestStatusUpdate update)
		{
			using (var connection = new SqlConnection(_connectionString))
			{
				var parameters = new
				{
					request_id = id,
					request_status = update.request_status,
					payment_status = update.payment_status,
					last_updated = update.last_updated ?? DateTime.Now
				};

				var query = "UPDATE tblRequest SET request_status = @request_status, payment_status = @payment_status, last_updated = @last_updated WHERE request_id = @request_id";
				var affectedRows = await connection.ExecuteAsync(query, parameters);
				return affectedRows == 1 ? Ok(true) : NotFound(false);
			}
		}

		[HttpDelete]
		public bool Delete(int id)
		{
			return requestServices.Delete(id);
		}

		public class RequestStatusUpdate
		{
			public string request_status { get; set; }
			public string payment_status { get; set; }
			public DateTime? last_updated { get; set; }
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
