using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Script.Serialization;
using Thermo_Puck.Models.Helpers;

namespace Thermo_Puck.Controllers
{
    //[Authorize]
    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    public class ValuesController : ApiController
    {
        // GET api/values
        public string Get()
        {
            TextFileReader reader = new TextFileReader();
            string output = new JavaScriptSerializer().Serialize(reader.RetrieveCurrentData());

            return output;
        }

        // GET api/values/5
        public string Get(int id)
        {
            COMPortReader reader = new COMPortReader();
            string output = new JavaScriptSerializer().Serialize(reader.ReadData());

            return output;
        }

        // POST api/values
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}
