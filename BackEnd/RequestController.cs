using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using Dapper;

namespace GabayHalamanAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequestController : ControllerBase
    {
        private readonly string _connectionString;

        public RequestController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // GET: api/request/delivery-window/{clientId}
        [HttpGet("delivery-window/{clientId}")]
        public async Task<IActionResult> GetClientDeliveryWindow(int clientId)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    var parameters = new { client_id = clientId };
                    var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
                        "SP_GetClientDeliveryWindow",
                        parameters,
                        commandType: CommandType.StoredProcedure
                    );

                    if (result == null)
                    {
                        return NotFound(new { message = "No delivery window found for this client" });
                    }

                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving delivery window", error = ex.Message });
            }
        }

        // Other existing request endpoints...
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Implementation for getting all requests
            return Ok(new { message = "Get all requests endpoint" });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            // Implementation for getting request by ID
            return Ok(new { message = $"Get request {id} endpoint" });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] object request)
        {
            // Implementation for creating request
            return Created("", new { message = "Request created" });
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] object request)
        {
            // Implementation for updating request
            return Ok(new { message = "Request updated" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // Implementation for deleting request
            return Ok(new { message = "Request deleted" });
        }
    }
}