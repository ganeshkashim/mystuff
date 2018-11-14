using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ParseThreadIndex
{
    class Program
    {
        static void Main(string[] args)
        {
            string ThreadIndex = "AdRn3AJrW7hFd3HATQyaQq3UhKBgxg==";
            byte[] bytes = System.Convert.FromBase64String(ThreadIndex);
            string hex = BitConverter.ToString(bytes);
            Console.WriteLine("Hex - " + hex);
            hex = hex.Replace("-", string.Empty);
            string guid = hex.Substring(12);
            Console.WriteLine("Guid is " + new Guid(guid));
            

            //string hex_date_withoutReserve = hex.Substring(2, 10);
            string hex_date_withReserve = hex.Substring(0, 12)+"0000";
                        
            long hexValue = Int64.Parse(hex_date_withReserve, NumberStyles.HexNumber);
            Console.WriteLine(hexValue);                       
            DateTime myDateTime = new DateTime(hexValue, DateTimeKind.Utc).AddYears(1600);
            Console.WriteLine("Date is " + myDateTime);
            Console.ReadLine();

            //string input = "2011787166315";
            //StringBuilder numerics = new StringBuilder();

            //for (int i = 0; i < input.Length / 2; i++)
            //    numerics.Append(Convert.ToInt32(input.Substring(i * 2, 2)) - 30);

            //DateTime date = DateTime.ParseExact(numerics.ToString(),
            //   "yyyyMMddHHmmss",
            //   new CultureInfo("en-US"));

            //Console.WriteLine(date.ToString("dd.MM.yyyy HH:mm:ss"));
            //Console.ReadLine();
        }
    }
}
