using Microsoft.AspNetCore.Mvc;
using ProjectName.Models;
using ProjectName.Services;
using System.Data.SqlClient;
using System.Data;
using Dapper;

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class PlantController : Controller
	{
		PlantService plantServices = new PlantService();
		private readonly string _connectionString = "Server=localhost;Database=GabayHalamanDB;Trusted_Connection=True;"; // Update with your connection string

		[HttpGet]
		public ActionResult GetAll()
		{
			var book = plantServices.GetAll();
			return Ok(book);
		}

		[HttpGet("{id:int}")]
		public Plant GetById(int id)
		{
			return plantServices.GetById(id);
		}

		[HttpPost]
		public async Task<ActionResult<int>> Add(Plant p)
	{
			try
			{
				p.image_path = await PersistInlineImagesIfNeeded(p.image_path);
			}
			catch (InvalidOperationException error)
			{
				return BadRequest(new { message = error.Message });
			}

		var newPlantId = plantServices.Add(p);
		if (newPlantId <= 0)
		{
			return BadRequest("Failed to create plant.");
		}

		return CreatedAtAction(nameof(GetById), new { id = newPlantId }, newPlantId);
		}

		[HttpPut]
		public async Task<ActionResult<bool>> Update(Plant p)
		{
			try
			{
				p.image_path = await PersistInlineImagesIfNeeded(p.image_path);
			}
			catch (InvalidOperationException error)
			{
				return BadRequest(new { message = error.Message });
			}

			return Ok(plantServices.Updatet(p));
		}

		[HttpDelete("{id}")]
		public bool Delete(int id)
		{
			return plantServices.Delete(id);
		}

		// SP7: GetPlantTotal
		[HttpGet("total/{plantId}")]
		public async Task<IActionResult> GetPlantTotal(int plantId)
		{
			using (var connection = new SqlConnection(_connectionString))
			{
				var parameters = new { plant_id = plantId };
				var result = await connection.QueryFirstOrDefaultAsync("SP_GetPlantTotal", parameters, commandType: CommandType.StoredProcedure);
				return Ok(result);
			}
		}

		// SP9: GetPopularPlants
		[HttpGet("popular/{minQuantity}")]
		public async Task<IActionResult> GetPopularPlants(int minQuantity)
		{
			using (var connection = new SqlConnection(_connectionString))
			{
				var parameters = new { min_quantity = minQuantity };
				var result = await connection.QueryAsync("SP_GetPopularPlants", parameters, commandType: CommandType.StoredProcedure);
				return Ok(result);
			}
		}

		private static bool IsInlineImage(string value)
		{
			return (value ?? string.Empty).Trim().StartsWith("data:image/", StringComparison.OrdinalIgnoreCase);
		}

		private static List<string> ParseImagePayload(string imagePath)
		{
			var raw = (imagePath ?? string.Empty).Trim();
			if (String.IsNullOrWhiteSpace(raw))
			{
				return new List<string>();
			}

			if (raw.StartsWith("["))
			{
				try
				{
					var parsed = System.Text.Json.JsonSerializer.Deserialize<List<string>>(raw);
					if (parsed != null)
					{
						return parsed
							.Select(item => (item ?? string.Empty).Trim())
							.Where(item => !String.IsNullOrWhiteSpace(item))
							.Take(4)
							.ToList();
					}
				}
				catch
				{
					// Fall back to plain string parsing.
				}
			}

			if (raw.Contains("||"))
			{
				return raw.Split("||", StringSplitOptions.RemoveEmptyEntries)
					.Select(item => (item ?? string.Empty).Trim())
					.Where(item => !String.IsNullOrWhiteSpace(item))
					.Take(4)
					.ToList();
			}

			if (!raw.StartsWith("data:", StringComparison.OrdinalIgnoreCase) && raw.Contains(','))
			{
				var split = raw.Split(',', StringSplitOptions.RemoveEmptyEntries)
					.Select(item => (item ?? string.Empty).Trim())
					.Where(item => !String.IsNullOrWhiteSpace(item))
					.Take(4)
					.ToList();

				if (split.Count > 1)
				{
					return split;
				}
			}

			return new List<string> { raw };
		}

		private async Task<string> PersistInlineImagesIfNeeded(string imagePath)
		{
			var parsedImages = ParseImagePayload(imagePath);
			if (parsedImages.Count == 0)
			{
				return String.Empty;
			}

			var persistedImages = new List<string>();
			foreach (var image in parsedImages)
			{
				persistedImages.Add(await PersistSingleImageIfNeeded(image));
			}

			if (persistedImages.Count == 1)
			{
				return persistedImages[0];
			}

			return System.Text.Json.JsonSerializer.Serialize(persistedImages);
		}

		private async Task<string> PersistSingleImageIfNeeded(string imageValue)
		{
			var rawData = (imageValue ?? string.Empty).Trim();
			if (!IsInlineImage(rawData))
			{
				return rawData;
			}

			var commaIndex = rawData.IndexOf(',');
			if (commaIndex < 0)
			{
				throw new InvalidOperationException("Invalid image data format.");
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
				throw new InvalidOperationException("Unable to decode image data.");
			}

			if (imageBytes.Length == 0)
			{
				throw new InvalidOperationException("Decoded image data is empty.");
			}

			const int maxImageBytes = 12 * 1024 * 1024;
			if (imageBytes.Length > maxImageBytes)
			{
				throw new InvalidOperationException("Image is too large. Maximum file size is 12 MB.");
			}

			var uploadsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "plants");
			Directory.CreateDirectory(uploadsDirectory);

			var token = Guid.NewGuid().ToString("N").Substring(0, 10);
			var fileName = $"{token}{extension}";
			var fullFilePath = Path.Combine(uploadsDirectory, fileName);
			await System.IO.File.WriteAllBytesAsync(fullFilePath, imageBytes);

			return $"/uploads/plants/{fileName}";
		}
	}
}
