using Microsoft.AspNetCore.Mvc;
using ProjectName.Models;
using ProjectName.Services;

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class RequestController : Controller
	{
		RequestService requestServices = new RequestService();

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

		[HttpDelete]
		public bool Delete(int id)
		{
			return requestServices.Delete(id);
		}

	}
}
