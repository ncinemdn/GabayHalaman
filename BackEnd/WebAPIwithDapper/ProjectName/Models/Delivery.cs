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
		[Column("full_name")]
		public string full_name { get; set; }
		[Column("email")]
		public string email { get; set; }
		[Column("contact_number")]
		public int contact_number { get; set; }
		[Column("delivery_address")]
		public string delivery_address { get; set; }
		[Column("delivery_status")]
		public string delivery_status { get; set; }
		[Column("scheduled_date")]
		public int scheduled_date { get; set; }
		[Column("time_window")]
		public string time_window { get; set; }
		[Column("delivery_notes")]
		public string delivery_notes { get; set; }
		[Column("created_at")]
		public DateTime created_at { get; set; }
	}
}
