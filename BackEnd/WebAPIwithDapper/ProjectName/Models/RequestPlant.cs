using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Models
{
	[Table("tblRequestPlant")]
	public class RequestPlant
	{
		[Key]
		public int request_plant_id { get; set; }
		[Column("request_id")]
		public int request_id { get; set; }
		[Column("plant_size_id")]
		public int plant_size_id { get; set; }
		[Column("quantity")]
		public int quantity { get; set; }
		[Column("price_at_order")]
		public int price_at_order { get; set; }

	}
}
