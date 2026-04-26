using Microsoft.AspNetCore.Mvc;
using ProjectName.Models;
using ProjectName.Services;
using BCrypt.Net;
using System.Collections.Concurrent;
using System.IO;

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AdminController : Controller
	{
		AdminService adminServices = new AdminService();

		private static readonly ConcurrentDictionary<string, PendingSignup> PendingSignups = new();

		private class PendingSignup
		{
			public string FullName { get; set; }
			public string Email { get; set; }
			public string Phone { get; set; }
			public string PasswordHash { get; set; }
			public string VerificationCode { get; set; }
			public DateTime CodeExpiry { get; set; }
		}

		// =========================
		// ✅ REQUEST MODELS
		// =========================

		public class EmailRequest
		{
			public string Email { get; set; }
		}

		public class VerifyCodeRequest
		{
			public string Email { get; set; }
			public string Code { get; set; }
		}

		public class LoginRequest
		{
			public string Email { get; set; }
			public string Password { get; set; }
		}

		public class ResetPasswordRequest
		{
			public string Email { get; set; }
			public string NewPassword { get; set; }
		}

		// =========================
		// 🎨 EMAIL TEMPLATE (REUSABLE)
		// =========================

		private string GenerateEmailTemplate(string title, string message, string code)
		{
			return $@"
            <div style='font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;'>
                <div style='max-width:500px; margin:auto; background:white; border-radius:10px; padding:25px; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.1);'>

                    <h2 style='color:#2e7d32;'>🌿 Gabay Halaman</h2>

                    <h3 style='color:#333;'>{title}</h3>

                    <p style='color:#555; font-size:15px;'>
                        {message}
                    </p>

                    <div style='font-size:32px; font-weight:bold; color:#2e7d32; margin:20px 0; letter-spacing:3px;'>
                        {code}
                    </div>

                    <p style='font-size:13px; color:#888;'>
                        This code will expire in 5 minutes.
                    </p>

                    <hr style='margin:20px 0;' />

                    <p style='font-size:11px; color:#aaa;'>
                        If you did not request this, you can safely ignore this email.
                    </p>

                </div>
            </div>";
		}

		// =========================
		// BASIC CRUD
		// =========================

		[HttpGet]
		public ActionResult GetAll()
		{
			return Ok(adminServices.GetAll());
		}

		[HttpGet("{id}")]
		public Admin GetById(int id)
		{
			return adminServices.GetById(id);
		}

		// =========================
		// SIGNUP
		// =========================

		[HttpPost("signup")]
		public async Task<IActionResult> Signup([FromBody] Admin admin)
		{
			var normalizedEmail = admin.email?.Trim().ToLower();

			if (string.IsNullOrWhiteSpace(admin.full_name) ||
				string.IsNullOrWhiteSpace(normalizedEmail) ||
				string.IsNullOrWhiteSpace(admin.phone) ||
				string.IsNullOrWhiteSpace(admin.password_hash))
			{
				return BadRequest("All signup fields are required.");
			}

			var existingAdmin = adminServices.GetByEmail(normalizedEmail);
			if (existingAdmin != null)
			{
				if (existingAdmin.is_verified)
					return BadRequest("Email is already registered.");

				return BadRequest("This email already has a pending account. Verify it first.");
			}

			if (PendingSignups.TryGetValue(normalizedEmail, out var pending) && pending.CodeExpiry > DateTime.Now)
			{
				return BadRequest("Verification code already sent. Wait for the current code to expire.");
			}

			var code = new Random().Next(100000, 999999).ToString();
			PendingSignups[normalizedEmail] = new PendingSignup
			{
				FullName = admin.full_name.Trim(),
				Email = normalizedEmail,
				Phone = admin.phone.Trim(),
				PasswordHash = BCrypt.Net.BCrypt.HashPassword(admin.password_hash),
				VerificationCode = code,
				CodeExpiry = DateTime.Now.AddMinutes(5)
			};

			EmailService emailService = new EmailService();
			await emailService.SendEmail(
				normalizedEmail,
				"Verify your Gabay Halaman Account 🌿",
				GenerateEmailTemplate(
					"Account Verification",
					"Welcome! Use the code below to verify your account:",
					code
				)
			);

			return Ok("Verification code sent.");
		}

		// =========================
		// VERIFY ACCOUNT
		// =========================

		[HttpPost("verify")]
		public IActionResult Verify([FromBody] VerifyCodeRequest data)
		{
			var normalizedEmail = data.Email?.Trim().ToLower();

			if (string.IsNullOrWhiteSpace(normalizedEmail) || string.IsNullOrWhiteSpace(data.Code))
				return BadRequest("Email and code are required.");

			if (PendingSignups.TryGetValue(normalizedEmail, out var pendingSignup))
			{
				if (pendingSignup.VerificationCode != data.Code)
					return BadRequest("Invalid code");

				if (pendingSignup.CodeExpiry < DateTime.Now)
					return BadRequest("Code expired");

				var verifiedAdmin = new Admin
				{
					full_name = pendingSignup.FullName,
					email = pendingSignup.Email,
					phone = pendingSignup.Phone,
					password_hash = pendingSignup.PasswordHash,
					created_at = DateTime.Now,
					updated_at = DateTime.Now,
					is_verified = true,
					verification_code = null,
					code_expiry = null
				};

				adminServices.Add(verifiedAdmin);
				PendingSignups.TryRemove(normalizedEmail, out _);

				return Ok("Account verified");
			}

			var admin = adminServices.GetByEmail(normalizedEmail);

			if (admin == null)
				return BadRequest("User not found");

			if (admin.verification_code != data.Code)
				return BadRequest("Invalid code");

			if (admin.code_expiry < DateTime.Now)
				return BadRequest("Code expired");

			admin.is_verified = true;
			admin.verification_code = null;

			adminServices.Updatet(admin);

			return Ok("Account verified");
		}

		// =========================
		// LOGIN
		// =========================

		[HttpPost("login")]
		public IActionResult Login([FromBody] LoginRequest data)
		{
			var admin = adminServices.GetByEmail(data.Email);

			if (admin == null)
				return BadRequest("User not found");

			if (!admin.is_verified)
				return BadRequest("Verify your email first");

			if (!BCrypt.Net.BCrypt.Verify(data.Password, admin.password_hash))
				return BadRequest("Incorrect password");

			return Ok(admin);
		}

		// =========================
		// FORGOT PASSWORD
		// =========================

		[HttpPost("forgot-password/send-code")]
		public async Task<IActionResult> SendCode([FromBody] EmailRequest data)
		{
			var admin = adminServices.GetByEmail(data.Email);

			if (admin == null)
				return BadRequest("Email not found");

			var code = new Random().Next(100000, 999999).ToString();

			admin.verification_code = code;
			admin.code_expiry = DateTime.Now.AddMinutes(5);

			adminServices.Updatet(admin);

			EmailService emailService = new EmailService();
			await emailService.SendEmail(
				data.Email,
				"Reset Password Code",
				GenerateEmailTemplate(
					"Password Reset",
					"Use the code below to reset your password:",
					code
				)
			);

			return Ok("Code sent");
		}

		[HttpPost("forgot-password/verify-code")]
		public IActionResult VerifyCode([FromBody] VerifyCodeRequest data)
		{
			var admin = adminServices.GetByEmail(data.Email);

			if (admin == null)
				return BadRequest("User not found");

			if (admin.verification_code != data.Code)
				return BadRequest("Invalid code");

			if (admin.code_expiry < DateTime.Now)
				return BadRequest("Code expired");

			return Ok("Code verified");
		}

		[HttpPost("forgot-password/reset-password")]
		public IActionResult ResetPassword([FromBody] ResetPasswordRequest data)
		{
			var admin = adminServices.GetByEmail(data.Email);

			if (admin == null)
				return BadRequest("User not found");

			admin.password_hash = BCrypt.Net.BCrypt.HashPassword(data.NewPassword);
			admin.verification_code = null;

			adminServices.Updatet(admin);

			return Ok("Password updated");
		}

		// =========================
		// RESEND VERIFICATION
		// =========================

		[HttpPost("resend-verification")]
		public async Task<IActionResult> ResendVerification([FromBody] EmailRequest data)
		{
			var normalizedEmail = data.Email?.Trim().ToLower();

			if (string.IsNullOrWhiteSpace(normalizedEmail))
				return BadRequest("Email is required");

			if (PendingSignups.TryGetValue(normalizedEmail, out var pendingSignup))
			{
				if (pendingSignup.CodeExpiry > DateTime.Now)
					return BadRequest("Current code is still active. Please wait for expiration.");

				var pendingCode = new Random().Next(100000, 999999).ToString();
				pendingSignup.VerificationCode = pendingCode;
				pendingSignup.CodeExpiry = DateTime.Now.AddMinutes(5);
				PendingSignups[normalizedEmail] = pendingSignup;

				EmailService pendingEmailService = new EmailService();
				await pendingEmailService.SendEmail(
					normalizedEmail,
					"Verification Code",
					GenerateEmailTemplate(
						"Resend Verification",
						"Here is your new verification code:",
						pendingCode
					)
				);

				return Ok("Verification code resent");
			}

			var admin = adminServices.GetByEmail(normalizedEmail);

			if (admin == null)
				return BadRequest("User not found");

			if (admin.code_expiry.HasValue && admin.code_expiry.Value > DateTime.Now)
				return BadRequest("Current code is still active. Please wait for expiration.");

			var code = new Random().Next(100000, 999999).ToString();

			admin.verification_code = code;
			admin.code_expiry = DateTime.Now.AddMinutes(5);

			adminServices.Updatet(admin);

			EmailService emailService = new EmailService();
			await emailService.SendEmail(
				normalizedEmail,
				"Verification Code",
				GenerateEmailTemplate(
					"Resend Verification",
					"Here is your new verification code:",
					code
				)
			);

			return Ok("Verification code resent");
		}

		// =========================
		// UPDATE / DELETE
		// =========================

		[HttpPut]
		public async Task<ActionResult<bool>> Update(Admin ad)
		{
			try
			{
				ad.photo = await PersistInlinePhotoIfNeeded(ad.photo);
			}
			catch (InvalidOperationException error)
			{
				return BadRequest(new { message = error.Message });
			}

			return Ok(adminServices.Updatet(ad));
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

		private static bool IsInlineImage(string value)
		{
			return (value ?? string.Empty).Trim().StartsWith("data:image/", StringComparison.OrdinalIgnoreCase);
		}

		private async Task<string> PersistInlinePhotoIfNeeded(string photoValue)
		{
			var rawData = (photoValue ?? string.Empty).Trim();
			if (string.IsNullOrWhiteSpace(rawData) || !IsInlineImage(rawData))
			{
				return rawData;
			}

			var commaIndex = rawData.IndexOf(',');
			if (commaIndex < 0)
			{
				throw new InvalidOperationException("Invalid profile photo data format.");
			}

			var metadata = rawData.Substring(5, commaIndex - 5);
			var base64Payload = rawData.Substring(commaIndex + 1);
			var extension = ".jpg";
			if (metadata.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
			{
				var mediaType = metadata.Split(';')[0];
				var imageType = mediaType.Substring("image/".Length).Trim().ToLowerInvariant();
				extension = imageType switch
				{
					"jpeg" => ".jpg",
					"jpg" => ".jpg",
					"png" => ".png",
					"webp" => ".webp",
					"gif" => ".gif",
					_ => ".jpg"
				};
			}

			byte[] imageBytes;
			try
			{
				imageBytes = Convert.FromBase64String(base64Payload);
			}
			catch
			{
				throw new InvalidOperationException("Unable to decode profile photo.");
			}

			if (imageBytes.Length == 0)
			{
				throw new InvalidOperationException("Decoded profile photo is empty.");
			}

			const int maxImageBytes = 5 * 1024 * 1024;
			if (imageBytes.Length > maxImageBytes)
			{
				throw new InvalidOperationException("Profile photo is too large. Maximum file size is 5 MB.");
			}

			var uploadsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "admin");
			Directory.CreateDirectory(uploadsDirectory);

			var token = Guid.NewGuid().ToString("N").Substring(0, 10);
			var fileName = $"admin-{token}{extension}";
			var fullFilePath = Path.Combine(uploadsDirectory, fileName);
			await System.IO.File.WriteAllBytesAsync(fullFilePath, imageBytes);

			return $"/uploads/admin/{fileName}";
		}
	}
}