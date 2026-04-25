using ProjectName.Models;
using ProjectName.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Services
{
	public class AdminService
	{
		public AdminService()
		{

		}

		public IEnumerable<Admin> GetAll()
		{
			AdminRepository adminRepository = new AdminRepository();
			return adminRepository.GetAll();
		}

		public Admin GetById(int id)
		{
			AdminRepository adminRepository = new AdminRepository();
			return adminRepository.GetbyId(id);
		}

		public Admin GetByEmail(string email)
		{
			if (string.IsNullOrWhiteSpace(email))
			{
				return null;
			}

			var normalizedEmail = email.Trim().ToLower();

			AdminRepository adminRepository = new AdminRepository();
			return adminRepository.GetAll()
				.FirstOrDefault(a => !string.IsNullOrWhiteSpace(a.email) && a.email.Trim().ToLower() == normalizedEmail);
		}
		public bool Add(Admin ad)
		{
			AdminRepository adminRepository = new AdminRepository();
			return adminRepository.Add(ad);
		}

		public bool Delete(int id)
		{
			AdminRepository adminRepository = new AdminRepository();
			return adminRepository.Delete(id);
		}
		public bool Updatet(Admin ad)
		{
			AdminRepository adminRepository = new AdminRepository();
			return adminRepository.Update(ad);
		}

		public bool ChangePassword(int id, string currentPassword, string newPassword)
		{
			AdminRepository adminRepository = new AdminRepository();
			var admin = adminRepository.GetbyId(id);
			if (admin == null || admin.password_hash != currentPassword)
			{
				return false;
			}
			admin.password_hash = newPassword;
			return adminRepository.Update(admin);
		}


	}
}
