using ProjectName.Models;
using ProjectName.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Services
{
	public class RequestService
	{
		public RequestService()
		{

		}

		public IEnumerable<Request> GetAll()
		{
			RequestRepository requestRepository = new RequestRepository();
			return requestRepository.GetAll();
		}

		public Request GetById(int id)
		{
			RequestRepository requestRepository = new RequestRepository();
			return requestRepository.GetbyId(id);
		}
		public bool Add(Request rq)
		{
			RequestRepository requestRepository = new RequestRepository();
			return requestRepository.Add(rq);
		}

		public bool Delete(int id)
		{
			RequestRepository requestRepository = new RequestRepository();
			return requestRepository.Delete(id);
		}
		public bool Updatet(Request rq)
		{
			RequestRepository requestRepository = new RequestRepository();
			return requestRepository.Update(rq);
		}


	}
}
