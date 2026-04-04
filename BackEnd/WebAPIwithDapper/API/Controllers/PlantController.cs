using Microsoft.AspNetCore.Mvc;
using ProjectName.Models;
using ProjectName.Services;

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class PlantController : Controller
	{
		PlantService plantServices = new PlantService();

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
		public bool Add(Plant p)
		{
			return plantServices.Add(p);
		}

		[HttpPut]
		public bool Update(Plant p)
		{
			return plantServices.Updatet(p);
		}

		[HttpDelete]
		public bool Delete(int id)
		{
			return plantServices.Delete(id);
		}

	}
}
