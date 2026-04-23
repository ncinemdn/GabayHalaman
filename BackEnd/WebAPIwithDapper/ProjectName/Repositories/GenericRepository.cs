using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using ProjectName.Models;
using Microsoft.Extensions.Configuration;

namespace ProjectName.Repositories
{
    public class GenericRepository<T>: IGenericRepository<T> where T : class
    {
        IDbConnection connection;
        readonly string connectionString;
		public GenericRepository()
		{
			connectionString = "Server=.\\SQLEXPRESS;Database=GabayHalamanDB;Trusted_Connection=True;";
			connection = new SqlConnection(connectionString);
		}

		public IEnumerable<T> GetAll()
        {
            try
            {
                if (connection.State == ConnectionState.Closed)
                    connection.Open();

                string tableName = GetTableName();
                string query = $"SELECT * FROM {tableName}";
                return connection.Query<T>(query);
            }
            finally
            {
                if (connection.State == ConnectionState.Open)
                    connection.Close();
            }
        }



        public T GetbyId(int id)
        {
            try
            {
                if (connection.State == ConnectionState.Closed)
                    connection.Open();

                string tableName = GetTableName();
                string query = $"SELECT * FROM {tableName} WHERE Id = @Id";

                return connection.QueryFirstOrDefault<T>(query, new { Id = id });
            }
            finally
            {
                if (connection.State == ConnectionState.Open)
                    connection.Close();
            }
        }

        public bool Add(T Entity)
        {
            try
            {
                if (connection.State == ConnectionState.Closed)
                    connection.Open();

                string tableName = GetTableName();
                string columns = GetColumnNames();
                string values = GetColumnValues();

                string query = $"INSERT INTO {tableName} ({columns}) VALUES ({values})";

                int affectedRow = 0;
                affectedRow = connection.Execute(query, Entity);
                return affectedRow == 1;
            }
            finally
            {
                if (connection.State == ConnectionState.Open)
                    connection.Close();
            }
        }

        public bool Update(T Entity)
        {
            try
            {
                if (connection.State == ConnectionState.Closed)
                    connection.Open();

                string tableName = GetTableName();
                string setClause = GetSetClause(Entity);
                string query = $"UPDATE {tableName} SET {setClause} WHERE Id = @Id";

                int affectedRow = 0;
                affectedRow = connection.Execute(query, Entity);
                return affectedRow == 1;
            }
            finally
            {
                if (connection.State == ConnectionState.Open)
                    connection.Close();
            }
        }

        private string GetSetClause(T entity)
        {
            var properties = typeof(T).GetProperties()
                .Where(p => p.Name != "Id");

            var setClause = string.Join(", ", properties.Select(p => $"{p.Name} = @{p.Name}"));
            return setClause;
        }


        public bool Delete(int id)
        {
            try
            {
                if (connection.State == ConnectionState.Closed)
                    connection.Open();

                string tableName = GetTableName();
                string query = $"DELETE FROM {tableName} WHERE Id = @Id";

                int affectedRow = 0;
                affectedRow = connection.Execute(query, new { Id = id });
                return affectedRow == 1;
            }
            finally
            {
                if (connection.State == ConnectionState.Open)
                    connection.Close();
            }
        }

        public string GetTableName()
        {
            string tableName = "";
            var type = typeof(T);
            var tableAttr = type.GetCustomAttribute<TableAttribute>();
            if (tableAttr != null)
            {
                tableName = $"[{tableAttr.Name}]";
            }
            return tableName;
        }

        public string GetColumnNames(bool excludeKey = true)
        {
            var type = typeof(T);
            var columns = string.Join(",", type.GetProperties()
                .Where(p => !excludeKey || !p.IsDefined(typeof(KeyAttribute)))
                .Select(p =>
                {
                    var columnAttr = p.GetCustomAttribute<ColumnAttribute>();
                    return columnAttr != null ? columnAttr.Name : p.Name;
                }));
            return columns;
        }

        public string GetColumnValues(bool excludeKey = true)
        {

            var columnValues = typeof(T).GetProperties()
                .Where(p => !excludeKey || p.GetCustomAttribute<KeyAttribute>() == null);
            var values = string.Join(",", columnValues.Select(p =>
            {
                return $"@{p.Name}";
            }));

            return values;
        }

        /*IEnumerable<T> IGenericRepository<T>.GetAll()
        {
            throw new NotImplementedException();
        }
        public IEnumerable<Book> GetAll()
        {
            return connection.Query<Book>(
                "spBooks_GetAll",
                commandType: CommandType.StoredProcedure);
        }*/

    }
}
