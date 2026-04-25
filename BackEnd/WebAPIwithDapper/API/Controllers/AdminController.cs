using Microsoft.AspNetCore.Mvc;
using ProjectName.Models;
using ProjectName.Services;
using BCrypt.Net;

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

		[HttpPost("signup")]
		public async Task<IActionResult> Signup([FromBody] Admin admin)
		{
			// 🔐 HASH PASSWORD
			admin.password_hash = BCrypt.Net.BCrypt.HashPassword(admin.password_hash);

			admin.created_at = DateTime.Now;
			admin.updated_at = DateTime.Now;

			// 🔢 GENERATE CODE
			var code = new Random().Next(100000, 999999).ToString();

			admin.verification_code = code;
			admin.code_expiry = DateTime.Now.AddMinutes(5);
			admin.is_verified = false;

			adminServices.Add(admin);

			// 📧 SEND EMAIL
			EmailService emailService = new EmailService();
			await emailService.SendEmail(
	admin.email,
	"Verify your Gabay Halaman Account 🌿",
	$@"
    <div style='font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8;'>
        <div style='max-width: 500px; margin: auto; background: white; border-radius: 10px; padding: 20px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);'>
            
            <h2 style='color: #2e7d32;'>🌿 Gabay Halaman</h2>
            
            <p style='font-size: 16px; color: #333;'>
                Hello! Please verify your account using the code below:
            </p>

            <div style='font-size: 30px; font-weight: bold; color: #2e7d32; margin: 20px 0;'>
                {code}
            </div>

            <p style='font-size: 14px; color: #777;'>
                This code will expire in 5 minutes.
            </p>

            <hr style='margin: 20px 0;' />

            <p style='font-size: 12px; color: #aaa;'>
                If you did not request this, please ignore this email.
            </p>
        </div>
    </div>
    "
);

			return Ok("Verification code sent to email.");
		}

		[HttpPost("verify")]
		public IActionResult Verify([FromBody] dynamic data)
		{
			string email = data.email;
			string code = data.code;

			var admin = adminServices.GetByEmail(email);

			if (admin == null)
				return BadRequest("User not found");

			if (admin.verification_code != code)
				return BadRequest("Invalid code");

			if (admin.code_expiry < DateTime.Now)
				return BadRequest("Code expired");

			admin.is_verified = true;
			admin.verification_code = null;

			adminServices.Updatet(admin);

			return Ok("Account verified");
		}

		[HttpPost("login")]
		public IActionResult Login([FromBody] dynamic data)
		{
			string email = data.email;
			string password = data.password;

			var admin = adminServices.GetByEmail(email);

			if (admin == null)
				return BadRequest("User not found");

			if (!admin.is_verified)
				return BadRequest("Please verify your email first");

			if (!BCrypt.Net.BCrypt.Verify(password, admin.password_hash))
				return BadRequest("Incorrect password");

			return Ok(admin);
		}

		[HttpPost("forgot-password/send-code")]
		public async Task<IActionResult> SendCode([FromBody] dynamic data)
		{
			string email = data.email;

			var admin = adminServices.GetByEmail(email);

			if (admin == null)
				return BadRequest("Email not found");

			var code = new Random().Next(100000, 999999).ToString();

			admin.verification_code = code;
			admin.code_expiry = DateTime.Now.AddMinutes(5);

			adminServices.Updatet(admin);

			EmailService emailService = new EmailService();
			await emailService.SendEmail(email, "Reset Code",
				$"Your reset code is: <b>{code}</b>");

			return Ok();
		}

		[HttpPost("forgot-password/verify-code")]
		public IActionResult VerifyCode([FromBody] dynamic data)
		{
			string email = data.email;
			string code = data.code;

			var admin = adminServices.GetByEmail(email);

			if (admin.verification_code != code)
				return BadRequest("Invalid code");

			if (admin.code_expiry < DateTime.Now)
				return BadRequest("Expired code");

			return Ok();
		}

		[HttpPost("forgot-password/reset-password")]
		public IActionResult ResetPassword([FromBody] dynamic data)
		{
			string email = data.email;
			string newPassword = data.newPassword;

			var admin = adminServices.GetByEmail(email);

			admin.password_hash = BCrypt.Net.BCrypt.HashPassword(newPassword);
			admin.verification_code = null;

			adminServices.Updatet(admin);

			return Ok();
		}

		[HttpPost("resend-verification")]
		public async Task<IActionResult> ResendVerification([FromBody] dynamic data)
		{
			string email = data.email;

			var admin = adminServices.GetByEmail(email);

			if (admin == null)
				return BadRequest("User not found");

			var code = new Random().Next(100000, 999999).ToString();

			admin.verification_code = code;
			admin.code_expiry = DateTime.Now.AddMinutes(5);

			adminServices.Updatet(admin);

			EmailService emailService = new EmailService();
			await emailService.SendEmail(email, "Verify your account",
$@"
<div style='font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8;'>
    <div style='max-width: 500px; margin: auto; background: white; border-radius: 10px; padding: 20px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);'>
        
        <h2 style='color: #2e7d32;'>🌿 Gabay Halaman</h2>
        
        <p style='font-size: 16px; color: #333;'>
            Here is your new verification code:
        </p>

        <div style='font-size: 30px; font-weight: bold; color: #2e7d32; margin: 20px 0;'>
            {code}
        </div>

        <p style='font-size: 14px; color: #777;'>
            This code will expire in 5 minutes.
        </p>

        <hr style='margin: 20px 0;' />

        <p style='font-size: 12px; color: #aaa;'>
            If you did not request this, please ignore this email.
        </p>
    </div>
</div>
");
			return Ok("Verification code resent");
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
