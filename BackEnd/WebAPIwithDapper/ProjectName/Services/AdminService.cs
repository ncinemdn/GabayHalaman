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


	}
}
