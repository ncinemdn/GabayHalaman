using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Models
{
	[Table("tblCartItem")]
	public class CartItem
	{
		[Key]
		public int cart_item_id { get; set; }
		[Column("client_id")]
		public string client_id { get; set; }
		[Column("plant_size_id")]
		public string plant_size_id { get; set; }
		[Column("quantity")]
		public string quantity { get; set; }
	}
}
