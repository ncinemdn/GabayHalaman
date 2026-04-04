using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Models
{
    [Table("tblClient")]
    public class Client
    {
        [Key]
        public int client_id { get; set; }
        [Column("full_name")]
        public string full_name { get; set; }
        [Column("email")]
        public string email { get; set; }
		[Column("contact_number")]
		public int contact_number { get; set; }
		[Column("address")]
		public string address { get; set; }
		[Column("created_at")]
		public int created_at { get; set; }
		[Column("updated_at")]
		public int updated_at { get; set; }
	}
}
