using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Models
{
	[Table("tblDelivery")]
	public class Delivery
	{
		[Key]
		public int delivery_id { get; set; }
		[Column("full_name")]
		public int request_id { get; set; }
		[Column("shipping_address")]
		public string shipping_address { get; set; }
		[Column("delivery_notes")]
		public string delivery_notes { get; set; }

	}
}
