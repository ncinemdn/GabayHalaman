using MailKit.Net.Smtp;
using MimeKit;

namespace ProjectName.Services
{
	public class EmailService
	{
		public async Task SendEmail(string toEmail, string subject, string body)
		{
			var email = new MimeMessage();
			email.From.Add(new MailboxAddress("Gabay Halaman", "gabayhalaman@gmail.com")); 
			email.To.Add(new MailboxAddress("", toEmail));
			email.Subject = subject;

			email.Body = new TextPart("html")
			{
				Text = body
			};

			using var smtp = new SmtpClient();
			await smtp.ConnectAsync("smtp.gmail.com", 587, false);
			await smtp.AuthenticateAsync("gabayhalaman@gmail.com", "dbcp vjbv ukjd toal"); 
			await smtp.SendAsync(email);
			await smtp.DisconnectAsync(true);
		}
	}
}