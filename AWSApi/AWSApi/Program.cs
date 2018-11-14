using System;
using System.Security.Cryptography;
using System.Text;

namespace AWSApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //========================= Task 1: Create a Canonical Request for Signature Version 4 =============================================================


            const string httpMethod = "GET"; //Step 1 - is to define the method(GET, POST, etc.)
            const string canonicalURI = "/"; //Step 2 - If the absolute path is empty, use a forward slash (/) - CanonicalURI
            //Step 3 - Create the canonical query string
            var queryString = "?Action=DescribeInstances&Version=2016-11-15&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIDEXAMPLE%2F20120215%2Fus-east-1%2Fec2%2Faws4_request&X-Amz-Date=20120215T000000Z&X-Amz-Signature=";
            const string canonicalHeaders = "host:ec2.amazonaws.com"; //Step 4 - Create the canonical headers
            const string signedHeaders = "host";//Step 5 - Create the signed headers
            var reqPayLoad = ComputeSha256Hash(""); //Step 6 - Get the Hash of the payload which is an empty string 
            var canonicalRequest = httpMethod + '\n' + canonicalURI + '\n' + queryString + '\n' + canonicalHeaders + '\n' + signedHeaders + '\n' +  reqPayLoad; //Step 7 - Combine elements to create canonical request
            var hashedCanonicalRequest = ComputeSha256Hash(canonicalRequest); //Step 8 - Create a digest (hash) of the canonical request with the same algorithm that you used to hash the payload.



            //========================= Task 2: Create a String to Sign for Signature Version 4 =============================================================


            const string algorithm = "AWS4-HMAC-SHA256"; //hashing algorithm that you use to calculate the digests in the canonical request
            const string requestDate = "20120215T000000Z"; //the request date value
            const string credentialScope = "20120215/us-east-1/ec2/aws4_request";//credential scope value
            var stringToSignIn = algorithm + '\n' + requestDate + '\n' + credentialScope + '\n' + hashedCanonicalRequest; //string to sign


            //========================= Task 3: Calculate the Signature for AWS Signature Version 4 =============================================================


            const string secretKey = "wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY"; //your secret access key
            const string dateStamp = "20120215"; //DateStamp
            const string regionName = "us-east-1";//Region Name
            const string serviceName = "ec2";//Service Name
            byte[] ksign = GetSignatureKey(secretKey, dateStamp, regionName, serviceName); //Get Signing key
            //string signature = convertByteToHex(ksign);
            byte[] finalKey = HmacSHA256(stringToSignIn, ksign); //Get Signature
            string signature = ConvertByteToHex(finalKey); //Convert Byte Array To Hex
            Console.WriteLine("Signature = " + signature);
            Console.WriteLine("========================= Final API =============================================================");

            //========================= Task 4: Add the Signature to the HTTP Request =============================================================

            queryString += signature; //Adding Signature to the Query String

            const string endPoint = "https://ec2.amazonaws.com/";


            Console.WriteLine(endPoint + queryString);
            Console.Read();

        }

        static string ComputeSha256Hash(string rawData)
        {
            // Create a SHA256   
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // ComputeHash - returns byte array  
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));
                return ConvertByteToHex(bytes);
            }
        }
       

        static byte[] GetSignatureKey(String key, String dateStamp, String regionName, String serviceName)
        {
            byte[] kSecret = Encoding.UTF8.GetBytes(("AWS4" + key));
            byte[] kDate = HmacSHA256(dateStamp, kSecret);
            Console.WriteLine("Date = " + ConvertByteToHex(kDate));
            byte[] kRegion = HmacSHA256(regionName, kDate);
            Console.WriteLine("Region = " + ConvertByteToHex(kRegion));
            byte[] kService = HmacSHA256(serviceName, kRegion);
            Console.WriteLine("Service = " + ConvertByteToHex(kService));
            byte[] kSigning = HmacSHA256("aws4_request", kService);
            Console.WriteLine("Signing = "+ ConvertByteToHex(kSigning));

            return kSigning;
        }

        static byte[] HmacSHA256(String data, byte[] key) { 

            using (HMACSHA256 hmac = new HMACSHA256(key))
            {
                return hmac.ComputeHash(Encoding.UTF8.GetBytes((data)));
            }

        }

        static string ConvertByteToHex(byte[] key)
        {
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < key.Length; i++)
            {
                builder.Append(key[i].ToString("x2"));//x2 signifies hexadecimal representation in lower case
            }
            return builder.ToString();

            
        }



    }  
}
