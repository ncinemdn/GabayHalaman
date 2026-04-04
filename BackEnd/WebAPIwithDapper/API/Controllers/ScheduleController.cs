using Microsoft.AspNetCore.Mvc;
using ProjectName.Models;
using ProjectName.Services;

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ScheduleController : Controller
	{
		ScheduleService scheduleServices = new ScheduleService();

		[HttpGet]
		public ActionResult GetAll()
		{
			var book = scheduleServices.GetAll();
			return Ok(book);
		}

		[HttpGet("{id}")]
		public Schedule GetById(int id)
		{
			return scheduleServices.GetById(id);
		}

		[HttpPost]
		public bool Add(Schedule s)
		{
			return scheduleServices.Add(s);
		}

		[HttpPut]
		public bool Update(Schedule s)
		{
			return scheduleServices.Updatet(s);
		}

		[HttpDelete]
		public bool Delete(int id)
		{
			return scheduleServices.Delete(id);
		}

	}
}
