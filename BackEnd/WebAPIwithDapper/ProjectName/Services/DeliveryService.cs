using ProjectName.Models;
using ProjectName.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Services
{
	public class DeliveryService
	{
		public DeliveryService()
		{

		}

		public IEnumerable<Delivery> GetAll()
		{
			DeliveryRepository deliveryRepository = new DeliveryRepository();
			return deliveryRepository.GetAll();
		}

		public Delivery GetById(int id)
		{
			DeliveryRepository deliveryRepository = new DeliveryRepository();
			return deliveryRepository.GetbyId(id);
		}
		public bool Add(Delivery d)
		{
			DeliveryRepository deliveryRepository = new DeliveryRepository();
			return deliveryRepository.Add(d);
		}

		public bool Delete(int id)
		{
			DeliveryRepository deliveryRepository = new DeliveryRepository();
			return deliveryRepository.Delete(id);
		}
		public bool Updatet(Delivery d)
		{
			DeliveryRepository deliveryRepository = new DeliveryRepository();
			return deliveryRepository.Update(d);
		}


	}
}
