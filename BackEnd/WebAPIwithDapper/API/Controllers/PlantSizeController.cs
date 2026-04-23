using Microsoft.AspNetCore.Mvc;
using ProjectName.Models;
using ProjectName.Services;

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class PlantSizeController : Controller
	{
		PlantSizeService plantsizeServices = new PlantSizeService();

		[HttpGet]
		public ActionResult GetAll()
		{
			var book = plantsizeServices.GetAll();
			return Ok(book);
		}

		[HttpGet("{id}")]
		public PlantSize GetById(int id)
		{
			return plantsizeServices.GetById(id);
		}

		[HttpPost]
		public bool Add(PlantSize ps)
		{
			return plantsizeServices.Add(ps);
		}

		[HttpPut]
		public bool Update(PlantSize ps)
		{
			return plantsizeServices.Updatet(ps);
		}

		[HttpDelete]
		public bool Delete(int id)
		{
			return plantsizeServices.Delete(id);
		}

	}
}
