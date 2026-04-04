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
		public string plant_name { get; set; }
		[Column("description")]
		public string description { get; set; }
		[Column("image_path")]
		public string image_path { get; set; }
		[Column("created_at")]
		public int created_at { get; set; }
		[Column("updated_at")]
		public int updated_at { get; set; }
	}
}
