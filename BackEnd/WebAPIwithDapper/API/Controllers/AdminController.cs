using Microsoft.AspNetCore.Mvc;
using ProjectName.Models;
using ProjectName.Services;

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AdminController : Controller
	{
		AdminService adminServices = new AdminService();

		[HttpGet]
		public ActionResult GetAll()
		{
			var book = adminServices.GetAll();
			return Ok(book);
		}

		[HttpGet("{id}")]
		public Admin GetById(int id)
		{
			return adminServices.GetById(id);
		}

		[HttpPost]
		public bool Add(Admin ad)
		{
			return adminServices.Add(ad);
		}

		[HttpPut]
		public bool Update(Admin ad)
		{
			return adminServices.Updatet(ad);
		}

		[HttpDelete]
		public bool Delete(int id)
		{
			return adminServices.Delete(id);
		}

		[HttpPut("change-password/{id}")]
		public bool ChangePassword(int id, [FromBody] ChangePasswordRequest request)
		{
			return adminServices.ChangePassword(id, request.CurrentPassword, request.NewPassword);
		}

	}
}
