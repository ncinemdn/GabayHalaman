using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Models
{
	[Table("tblAdminLog")]
	public class AdminLog
	{
		[Key]
		public int log_id { get; set; }
		[Column("admin_id")]
		public string admin_id { get; set; }
		[Column("action_performed")]
		public string action_performed { get; set; }
		[Column("module_used")]
		public string module_used { get; set; }
		[Column("status")]
		public string status { get; set; }
		[Column("created_at")]
		public DateTime created_at { get; set; }
	}
}
