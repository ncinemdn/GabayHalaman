using Microsoft.AspNetCore.Mvc;
using ProjectName.Models;
using ProjectName.Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : Controller
    {
        ClientService clientServices = new ClientService();

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

    }
}
