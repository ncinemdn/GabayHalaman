using ProjectName.Models;
using ProjectName.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Services
{
	public class ReviewService
	{
		public ReviewService()
		{

		}

		public IEnumerable<Review> GetAll()
		{
			ReviewRepository reviewRepository = new ReviewRepository();
			return reviewRepository.GetAll();
		}

		public Review GetById(int id)
		{
			ReviewRepository reviewRepository = new ReviewRepository();
			return reviewRepository.GetbyId(id);
		}
		public bool Add(Review rv)
		{
			ReviewRepository reviewRepository = new ReviewRepository();
			return reviewRepository.Add(rv);
		}

		public bool Delete(int id)
		{
			ReviewRepository reviewRepository = new ReviewRepository();
			return reviewRepository.Delete(id);
		}
		public bool Updatet(Review rv)
		{
			ReviewRepository reviewRepository = new ReviewRepository();
			return reviewRepository.Update(rv);
		}


	}
}
