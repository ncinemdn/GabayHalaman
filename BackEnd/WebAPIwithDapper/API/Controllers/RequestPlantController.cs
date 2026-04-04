using Microsoft.AspNetCore.Mvc;
using ProjectName.Models;
using ProjectName.Services;

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class RequestPlantController : Controller
	{
		RequestPlantService requestplantServices = new RequestPlantService();

		[HttpGet]
		public ActionResult GetAll()
		{
			var book = requestplantServices.GetAll();
			return Ok(book);
		}

		[HttpGet("{id}")]
		public RequestPlant GetById(int id)
		{
			return requestplantServices.GetById(id);
		}

		[HttpPost]
		public bool Add(RequestPlant rp)
		{
			return requestplantServices.Add(rp);
		}

		[HttpPut]
		public bool Update(RequestPlant rp)
		{
			return requestplantServices.Updatet(rp);
		}

		[HttpDelete]
		public bool Delete(int id)
		{
			return requestplantServices.Delete(id);
		}

	}
}
