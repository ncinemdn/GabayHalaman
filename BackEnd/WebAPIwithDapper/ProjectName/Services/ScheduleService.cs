using ProjectName.Models;
using ProjectName.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Services
{
	public class ScheduleService
	{
		public ScheduleService()
		{

		}

		public IEnumerable<Schedule> GetAll()
		{
			ScheduleRepository scheduleRepository = new ScheduleRepository();
			return scheduleRepository.GetAll();
		}

		public Schedule GetById(int id)
		{
			ScheduleRepository scheduleRepository = new ScheduleRepository();
			return scheduleRepository.GetbyId(id);
		}
		public bool Add(Schedule s)
		{
			ScheduleRepository scheduleRepository = new ScheduleRepository();
			return scheduleRepository.Add(s);
		}

		public bool Delete(int id)
		{
			ScheduleRepository scheduleRepository = new ScheduleRepository();
			return scheduleRepository.Delete(id);
		}
		public bool Updatet(Schedule s)
		{
			ScheduleRepository scheduleRepository = new ScheduleRepository();
			return scheduleRepository.Update(s);
		}


	}
}
