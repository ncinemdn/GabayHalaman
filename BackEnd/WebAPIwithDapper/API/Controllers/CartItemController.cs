using Microsoft.AspNetCore.Mvc;
using ProjectName.Models;
using ProjectName.Services;

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CartItemController : Controller
	{
		CartItemService cartitemServices = new CartItemService();

		[HttpGet]
		public ActionResult GetAll()
		{
			var book = cartitemServices.GetAll();
			return Ok(book);
		}

		[HttpGet("{id}")]
		public CartItem GetById(int id)
		{
			return cartitemServices.GetById(id);
		}

		[HttpPost]
		public bool Add(CartItem ci)
		{
			return cartitemServices.Add(ci);
		}

		[HttpPut]
		public bool Update(CartItem ci)
		{
			return cartitemServices.Updatet(ci);
		}

		[HttpDelete]
		public bool Delete(int id)
		{
			return cartitemServices.Delete(id);
		}

	}
}
