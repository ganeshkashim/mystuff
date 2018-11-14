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
            const string ThreadIndex = "AdRn3AJrW7hFd3HATQyaQq3UhKBgxg==";
            byte[] bytes = System.Convert.FromBase64String(ThreadIndex);
            string hex = BitConverter.ToString(bytes); //Convert to Byte to String
            Console.WriteLine("Hex - " + hex);
            hex = hex.Replace("-", string.Empty); //Remove '-'
            string guid = hex.Substring(12); //According to documentation the guid is after the first 12 b
            Console.WriteLine("Guid is " + new Guid(guid));
            //string hex_date_withoutReserve = hex.Substring(2, 10);
            string hex_date_withReserve = hex.Substring(0, 12)+"0000";
                        
            long hexValue = Int64.Parse(hex_date_withReserve, NumberStyles.HexNumber);                                  
            DateTime myDateTime = new DateTime(hexValue, DateTimeKind.Utc).AddYears(1600);
            Console.WriteLine("Date is " + myDateTime);
            Console.ReadLine();

            
        }
    }
}
