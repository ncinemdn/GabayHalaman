using Microsoft.AspNetCore.Mvc;
using ProjectName.Models;
using ProjectName.Services;

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class DeliveryController : Controller
	{
		DeliveryService deliveryServices = new DeliveryService();

		[HttpGet]
		public ActionResult GetAll()
		{
			var book = deliveryServices.GetAll();
			return Ok(book);
		}

		[HttpGet("{id}")]
		public Delivery GetById(int id)
		{
			return deliveryServices.GetById(id);
		}

		[HttpPost]
		public bool Add(Delivery c)
		{
			return deliveryServices.Add(c);
		}

		[HttpPut]
		public bool Update(Delivery c)
		{
			return deliveryServices.Updatet(c);
		}

		[HttpDelete]
		public bool Delete(int id)
		{
			return deliveryServices.Delete(id);
		}

	}
}
