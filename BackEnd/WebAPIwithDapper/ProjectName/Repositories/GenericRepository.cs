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

namespace ProjectName.Repositories
{
    public class GenericRepository<T>: IGenericRepository<T> where T : class
    {
        IDbConnection connection;
        readonly string connectionString = "Server=LAPTOP-21JQHQ4T; Database=GabayHalamanDB; Trusted_Connection=True; MultipleActiveResultSets=true";
        public GenericRepository()
        {
            connection = new SqlConnection(connectionString);

        }

        public IEnumerable<T> GetAll()
        {
            string tableName = GetTableName();

            string query = $"SELECT * FROM {tableName}";
            return connection.Query<T>(query);
        }



        public T GetbyId(int id)
        {
            string tableName = GetTableName();
            string columns = GetColumnNames();
            string values = GetColumnValues();

            string query = $"SELECT * FROM {tableName} WHERE Id = @Id";

            return connection.QueryFirstOrDefault<T>(query, new { Id = id });
        }

        public bool Add(T Entity)
        {
            string tableName = GetTableName();
            string columns = GetColumnNames();
            string values = GetColumnValues();

            string query = $"INSERT INTO {tableName} ({columns}) VALUES ({values})";

            int affectedRow = 0;
            affectedRow = connection.Execute(query, Entity);
            return affectedRow == 1;
        }

        public bool Update(T Entity)
        {
            string tableName = GetTableName();
            string setClause = GetSetClause(Entity);
            string query = $"UPDATE {tableName} SET {setClause} WHERE Id = @Id";

            int affectedRow = 0;
            affectedRow = connection.Execute(query, Entity);
            return affectedRow == 1;
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
            string tableName = GetTableName();
            string query = $"DELETE FROM {tableName} WHERE Id = @Id";

            int affectedRow = 0;
            affectedRow = connection.Execute(query, new { Id = id });
            return affectedRow == 1;
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
