using ProjectName.Models;
using ProjectName.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Services
{
	public class CartItemService
	{
		public CartItemService()
		{

		}

		public IEnumerable<CartItem> GetAll()
		{
			CartItemRepository cartitemRepository = new CartItemRepository();
			return cartitemRepository.GetAll();
		}

		public CartItem GetById(int id)
		{
			CartItemRepository cartitemRepository = new CartItemRepository();
			return cartitemRepository.GetbyId(id);
		}
		public bool Add(CartItem ci)
		{
			CartItemRepository cartitemRepository = new CartItemRepository();
			return cartitemRepository.Add(ci);
		}

		public bool Delete(int id)
		{
			CartItemRepository cartitemRepository = new CartItemRepository();
			return cartitemRepository.Delete(id);
		}
		public bool Updatet(CartItem ci)
		{
			CartItemRepository cartitemRepository = new CartItemRepository();
			return cartitemRepository.Update(ci);
		}


	}
}
