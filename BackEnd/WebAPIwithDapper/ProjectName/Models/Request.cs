using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Models
{
	[Table("tblRequest")]
	public class Request
	{
		[Key]
		public int request_id { get; set; }
		[Column("client_id")]
		public int client_id { get; set; }
		[Column("request_type")]
		public string request_type { get; set; }
		[Column("request_status")]
		public string request_status { get; set; }
		[Column("payment_status")]
		public string payment_status { get; set; }
		[Column("total_amount")]
		public int total_amount { get; set; }
		[Column("request_date")]
		public DateTime request_date { get; set; }
		[Column("last_updated")]
		public DateTime last_updated { get; set; }
	}
}
