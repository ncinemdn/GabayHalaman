using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Models
{
	[Table("tblReview")]
	public class Review
	{
		[Key]
		public int review_id { get; set; }
		[Column("plant_id")]
		public int plant_id { get; set; }
		[Column("client_id")]
		public int client_id { get; set; }
		[Column("rating")]
		public int rating { get; set; }
		[Column("comment")]
		public int comment { get; set; }
		[Column("created_at")]
		public DateTime created_at { get; set; }
	}
}
