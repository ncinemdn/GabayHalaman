using Microsoft.AspNetCore.Mvc;
using ProjectName.Models;
using ProjectName.Services;

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AdminLogController : Controller
	{
		AdminLogService adminlogServices = new AdminLogService();

		[HttpGet]
		public ActionResult GetAll()
		{
			var book = adminlogServices.GetAll();
			return Ok(book);
		}

		[HttpGet("{id}")]
		public AdminLog GetById(int id)
		{
			return adminlogServices.GetById(id);
		}

		[HttpPost]
		public bool Add(AdminLog al)
		{
			return adminlogServices.Add(al);
		}

		[HttpPut]
		public bool Update(AdminLog al)
		{
			return adminlogServices.Updatet(al);
		}

		[HttpDelete]
		public bool Delete(int id)
		{
			return adminlogServices.Delete(id);
		}

	}
}
