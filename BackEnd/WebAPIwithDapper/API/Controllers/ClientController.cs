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
    public class ClientController : Controller
    {
        ClientService clientServices = new ClientService();
        private readonly string _connectionString = "Server=localhost;Database=GabayHalamanDB;Trusted_Connection=True;"; // Update with your connection string

        [HttpGet]
        public ActionResult GetAll()
        {
            var book = clientServices.GetAll();
            return Ok(book);
        }

        [HttpGet("{id}")]
        public Client GetById(int id)
        {
            return clientServices.GetById(id);
        }

        [HttpPost]
        public bool Add(Client c)
        {
            return clientServices.Add(c);
        }
        
        [HttpPut]
        public bool Update(Client c)
        {
            return clientServices.Updatet(c);
        }

        [HttpDelete]
        public bool Delete(int id)
        {
            return clientServices.Delete(id);
        }

        // SP1: MinMaxPlantOrdered
        [HttpGet("min-max-plants/{clientId}")]
        public async Task<IActionResult> GetMinMaxPlantsOrdered(int clientId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new { client_id = clientId };
                var result = await connection.QueryFirstOrDefaultAsync("SP_MinMaxPlantOrdered", parameters, commandType: CommandType.StoredProcedure);
                return Ok(result);
            }
        }

        // SP2: CountTotalOrders
        [HttpGet("total-orders/{clientId}")]
        public async Task<IActionResult> GetTotalOrders(int clientId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new { client_id = clientId };
                var result = await connection.QueryFirstOrDefaultAsync("SP_CountTotalOrders", parameters, commandType: CommandType.StoredProcedure);
                return Ok(result);
            }
        }

        // SP5: GetClientRequestSummary
        [HttpGet("request-summary")]
        public async Task<IActionResult> GetClientRequestSummary(string? fullName = null, string? requestStatus = null)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new { full_name = fullName, RequestStatus = requestStatus };
                var result = await connection.QueryAsync("SP_GetClientRequestSummary", parameters, commandType: CommandType.StoredProcedure);
                return Ok(result);
            }
        }

        // SP6: GetClientTransactionSummary
        [HttpGet("transaction-summary")]
        public async Task<IActionResult> GetClientTransactionSummary(string transactionStatus = "Completed")
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new { TransactionStatus = transactionStatus };
                var result = await connection.QueryAsync("SP_GetClientTransactionSummary", parameters, commandType: CommandType.StoredProcedure);
                return Ok(result);
            }
        }

        // SP8: GetHighVolumeClients
        [HttpGet("high-volume-clients/{minQuantity}")]
        public async Task<IActionResult> GetHighVolumeClients(int minQuantity)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new { min_quantity = minQuantity };
                var result = await connection.QueryAsync("SP_GetHighVolumeClients", parameters, commandType: CommandType.StoredProcedure);
                return Ok(result);
            }
        }

        // SP10: GetClientDeliveryWindow
        [HttpGet("delivery-window/{clientId}")]
        public async Task<IActionResult> GetClientDeliveryWindow(int clientId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new { client_id = clientId };
                var result = await connection.QueryFirstOrDefaultAsync("SP_GetClientDeliveryWindow", parameters, commandType: CommandType.StoredProcedure);
                return Ok(result);
            }
        }

        // SP11: GetMostRequestedPlant
        [HttpGet("most-requested-plant/{clientId}")]
        public async Task<IActionResult> GetMostRequestedPlant(int clientId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new { client_id = clientId };
                var result = await connection.QueryFirstOrDefaultAsync("SP_GetMostRequestedPlant", parameters, commandType: CommandType.StoredProcedure);
                return Ok(result);
            }
        }

        // SP12: GetHighValueTransactions
        [HttpGet("high-value-transactions/{clientId}")]
        public async Task<IActionResult> GetHighValueTransactions(int clientId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new { client_id = clientId };
                var result = await connection.QueryAsync("SP_GetHighValueTransactions", parameters, commandType: CommandType.StoredProcedure);
                return Ok(result);
            }
        }
    }
}
