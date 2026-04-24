using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Models
{
	[Table("tblPlant")]
	public class Plant
	{
		[Key]
		public int plant_id { get; set; }

		[Column("category_id")]
		public int category_id { get; set; }

		[Column("plant_name")]
		public string plant_name { get; set; } = string.Empty;

		[Column("description")]
		public string description { get; set; } = string.Empty;

		[Column("image_path")]
		public string image_path { get; set; } = string.Empty;

		[Column("created_at")]
		public DateTime? CreatedAt { get; set; }

		[Column("updated_at")]
		public DateTime? UpdatedAt { get; set; }
	}
}
