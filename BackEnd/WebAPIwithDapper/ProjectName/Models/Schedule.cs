using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Models
{
	[Table("tblSchedule")]
	public class Schedule
	{
		[Key]
		public int schedule_id { get; set; }
		[Column("full_name")]
		public int request_id { get; set; }
		[Column("scheduled_date")]
		public string scheduled_date { get; set; }
		[Column("time_window")]
		public string time_window { get; set; }

	}
}
