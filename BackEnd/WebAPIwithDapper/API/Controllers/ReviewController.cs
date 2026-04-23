using Microsoft.AspNetCore.Mvc;
using ProjectName.Models;
using ProjectName.Services;

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ReviewController : Controller
	{
		ReviewService reviewServices = new ReviewService();

		[HttpGet]
		public ActionResult GetAll()
		{
			var book = reviewServices.GetAll();
			return Ok(book);
		}

		[HttpGet("{id}")]
		public Review GetById(int id)
		{
			return reviewServices.GetById(id);
		}

		[HttpPost]
		public bool Add(Review rv)
		{
			return reviewServices.Add(rv);
		}

		[HttpPut]
		public bool Update(Review rv)
		{
			return reviewServices.Updatet(rv);
		}

		[HttpDelete]
		public bool Delete(int id)
		{
			return reviewServices.Delete(id);
		}

	}
}
