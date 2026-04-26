using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Models
{
    [Table("tblAdmin")]
    public class Admin
    {
        [Key]
        public int admin_id { get; set; }

        [Column("full_name")]
        public string full_name { get; set; }

        [Column("email")]
        public string email { get; set; }

        [Column("phone")]
        public string phone { get; set; }

        [Column("photo")]
        public string? photo { get; set; }

        [Column("password_hash")]
		public string password_hash { get; set; }

		[Column("created_at")]
        public DateTime created_at { get; set; }

        [Column("updated_at")]
        public DateTime updated_at { get; set; }

        // ✅ ADD THESE (WITH COLUMN MAPPING)
        [Column("is_verified")]
        public bool is_verified { get; set; }

        [Column("verification_code")]
        public string? verification_code { get; set; }

        [Column("code_expiry")]
        public DateTime? code_expiry { get; set; }
	}
}
