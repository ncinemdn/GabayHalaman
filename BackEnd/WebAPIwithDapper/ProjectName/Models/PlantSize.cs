using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Models
{
	[Table("tblPlantSize")]
	public class PlantSize
	{
		[Key]
		public int plant_size_id { get; set; }
		[Column("plant_id")]
		public int plant_id { get; set; }
		[Column("size_name")]
		public string size_name { get; set; }
		[Column("price")]
		public int price { get; set; }
		[Column("stock_quantity")]
		public int stock_quantity { get; set; }
		[Column("is_available")]
		public string is_available { get; set; }
		[Column("created_at")]
		public DateTime created_at { get; set; }
		[Column("updated_at")]
		public DateTime updated_at { get; set; }
	}
}
