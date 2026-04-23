using ProjectName.Models;
using ProjectName.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Services
{
	public class AdminLogService
	{
		public AdminLogService()
		{

		}

		public IEnumerable<AdminLog> GetAll()
		{
			AdminLogRepository adminlogRepository = new AdminLogRepository();
			return adminlogRepository.GetAll();
		}

		public AdminLog GetById(int id)
		{
			AdminLogRepository adminlogRepository = new AdminLogRepository();
			return adminlogRepository.GetbyId(id);
		}
		public bool Add(AdminLog al)
		{
			AdminLogRepository adminlogRepository = new AdminLogRepository();
			return adminlogRepository.Add(al);
		}

		public bool Delete(int id)
		{
			AdminLogRepository adminlogRepository = new AdminLogRepository();
			return adminlogRepository.Delete(id);
		}
		public bool Updatet(AdminLog al)
		{
			AdminLogRepository adminlogRepository = new AdminLogRepository();
			return adminlogRepository.Update(al);
		}


	}
}
