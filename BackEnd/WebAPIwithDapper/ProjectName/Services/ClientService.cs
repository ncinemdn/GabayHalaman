using ProjectName.Models;
using ProjectName.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Services
{
    public class ClientService
    {
        public ClientService() 
        { 
            
        }

        public IEnumerable<Client> GetAll()
        {
            ClientRepository clientRepository = new ClientRepository();
            return clientRepository.GetAll();
        }

        public Client GetById(int id)
        {
            ClientRepository clientRepository = new ClientRepository();
            return clientRepository.GetbyId(id);
        }
        public bool Add(Client c)
        {
            ClientRepository clientRepository = new ClientRepository();
            return clientRepository.Add(c);
        }

        public bool Delete(int id)
        {
            ClientRepository clientRepository = new ClientRepository();
            return clientRepository.Delete(id);
        }
        public bool Updatet(Client c)
        {
            ClientRepository clientRepository = new ClientRepository();
            return clientRepository.Update(c);
        }


    }
}
