using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using Dapper;

namespace ProjectName.Repositories
{
	public class GenericRepository<T> : IGenericRepository<T> where T : class
	{
		IDbConnection connection;
		readonly string connectionString;

		public GenericRepository()
		{
			connectionString = "Server=LAPTOP-21JQHQ4T\\SQLEXPRESS;Database=GabayHalamanDB;Trusted_Connection=True;";
			connection = new SqlConnection(connectionString);
		}

		// ✅ GET ALL
		public IEnumerable<T> GetAll()
		{
			string tableName = GetTableName();
			string query = $"SELECT * FROM {tableName}";
			return connection.Query<T>(query);
		}

		// ✅ GET BY ID (FIXED)
		public T GetbyId(int id)
		{
			string tableName = GetTableName();
			string keyName = GetKeyName();

			string query = $"SELECT * FROM {tableName} WHERE {keyName} = @Id";

			return connection.QueryFirstOrDefault<T>(query, new { Id = id });
		}

		// ✅ INSERT
		public bool Add(T Entity)
		{
			string tableName = GetTableName();
			string columns = GetColumnNames();
			string values = GetColumnValues();

			string query = $"INSERT INTO {tableName} ({columns}) VALUES ({values})";

			int affectedRow = connection.Execute(query, Entity);
			return affectedRow == 1;
		}

		// ✅ UPDATE (FIXED)
		public bool Update(T Entity)
		{
			string tableName = GetTableName();
			string keyName = GetKeyName();
			string setClause = GetSetClause();

			string query = $"UPDATE {tableName} SET {setClause} WHERE {keyName} = @{keyName}";

			int affectedRow = connection.Execute(query, Entity);
			return affectedRow == 1;
		}

		// ✅ DELETE (FIXED)
		public bool Delete(int id)
		{
			string tableName = GetTableName();
			string keyName = GetKeyName();

			string query = $"DELETE FROM {tableName} WHERE {keyName} = @Id";

			int affectedRow = connection.Execute(query, new { Id = id });
			return affectedRow == 1;
		}

		// ✅ GET PRIMARY KEY NAME
		private string GetKeyName()
		{
			var keyProp = typeof(T).GetProperties()
				.FirstOrDefault(p => p.GetCustomAttributes(typeof(KeyAttribute), true).Any());

			if (keyProp == null)
				throw new Exception($"No [Key] found in {typeof(T).Name}");

			return keyProp.Name; // e.g. "plant_id"
		}

		private string GetSetClause()
		{
			var keyName = GetKeyName();

			var properties = typeof(T).GetProperties()
				.Where(p =>
					p.Name != keyName &&
					(!p.PropertyType.IsClass || p.PropertyType == typeof(string))
				);

			return string.Join(", ", properties.Select(p =>
			{
				var columnAttr = p.GetCustomAttribute<ColumnAttribute>();
				var columnName = columnAttr != null ? columnAttr.Name : p.Name;

				return $"{columnName} = @{p.Name}";
			}));
		}

		// ✅ TABLE NAME
		public string GetTableName()
		{
			var type = typeof(T);
			var tableAttr = type.GetCustomAttribute<TableAttribute>();

			if (tableAttr == null)
				throw new Exception($"No [Table] attribute found in {type.Name}");

			return $"[{tableAttr.Name}]";
		}

		// ✅ COLUMN NAMES (EXCLUDES KEY)
		public string GetColumnNames(bool excludeKey = true)
		{
			var type = typeof(T);

			return string.Join(",", type.GetProperties()
				.Where(p => !excludeKey || !p.IsDefined(typeof(KeyAttribute)))
				.Select(p =>
				{
					var columnAttr = p.GetCustomAttribute<ColumnAttribute>();
					return columnAttr != null ? columnAttr.Name : p.Name;
				}));
		}

		// ✅ COLUMN VALUES
		public string GetColumnValues(bool excludeKey = true)
		{
			var properties = typeof(T).GetProperties()
				.Where(p => !excludeKey || !p.IsDefined(typeof(KeyAttribute)));

			return string.Join(",", properties.Select(p => $"@{p.Name}"));
		}
	}
}