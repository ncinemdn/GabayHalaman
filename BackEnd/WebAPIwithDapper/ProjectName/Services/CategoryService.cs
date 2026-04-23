using ProjectName.Models;
using ProjectName.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Services
{
	public class CategoryService
	{
		public CategoryService()
		{

		}

		public IEnumerable<Category> GetAll()
		{
			CategoryRepository categoryRepository = new CategoryRepository();
			return categoryRepository.GetAll();
		}

		public Category GetById(int id)
		{
			CategoryRepository categoryRepository = new CategoryRepository();
			return categoryRepository.GetbyId(id);
		}
		public bool Add(Category ct)
		{
			CategoryRepository categoryRepository = new CategoryRepository();
			return categoryRepository.Add(ct);
		}

		public bool Delete(int id)
		{
			CategoryRepository categoryRepository = new CategoryRepository();
			return categoryRepository.Delete(id);
		}
		public bool Updatet(Category ct)
		{
			CategoryRepository categoryRepository = new CategoryRepository();
			return categoryRepository.Update(ct);
		}


	}
}
