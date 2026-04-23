using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Models
{
	[Table("tblCategory")]
	public class Category
	{
		[Key]
		public int category_id { get; set; }
		[Column("category_name")]
		public string category_name { get; set; }

	}
}
