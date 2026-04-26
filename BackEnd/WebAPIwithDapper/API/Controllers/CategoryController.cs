using Microsoft.AspNetCore.Mvc;
using ProjectName.Models;
using ProjectName.Services;

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CategoryController : Controller
	{
		CategoryService categoryServices = new CategoryService();

		[HttpGet]
		public ActionResult GetAll()
		{
			var book = categoryServices.GetAll();
			return Ok(book);
		}

		[HttpGet("{id}")]
		public Category GetById(int id)
		{
			return categoryServices.GetById(id);
		}

		[HttpPost]
		public bool Add(Category ct)
		{
			return categoryServices.Add(ct);
		}

		[HttpPut]
		public bool Update(Category ct)
		{
			return categoryServices.Updatet(ct);
		}

		[HttpDelete("{id:int}")]
		[HttpDelete]
		public bool Delete(int id)
		{
			return categoryServices.Delete(id);
		}

	}
}
