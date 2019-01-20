using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Thermo_Puck.Models;

namespace Thermo_Puck.Controllers
{
    public class SensorModelsController : ApiController
    {
        private Thermo_PuckContext db = new Thermo_PuckContext();

        // GET: api/SensorModels
        public IQueryable<SensorModel> GetSensorModels()
        {
            return db.SensorModels;
        }

        // GET: api/SensorModels/5
        [ResponseType(typeof(SensorModel))]
        public async Task<IHttpActionResult> GetSensorModel(int id)
        {
            SensorModel sensorModel = await db.SensorModels.FindAsync(id);
            if (sensorModel == null)
            {
                return NotFound();
            }

            return Ok(sensorModel);
        }

        // PUT: api/SensorModels/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutSensorModel(int id, SensorModel sensorModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != sensorModel.Id)
            {
                return BadRequest();
            }

            db.Entry(sensorModel).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SensorModelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/SensorModels
        [ResponseType(typeof(SensorModel))]
        public async Task<IHttpActionResult> PostSensorModel(SensorModel sensorModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.SensorModels.Add(sensorModel);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (SensorModelExists(sensorModel.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = sensorModel.Id }, sensorModel);
        }

        // DELETE: api/SensorModels/5
        [ResponseType(typeof(SensorModel))]
        public async Task<IHttpActionResult> DeleteSensorModel(int id)
        {
            SensorModel sensorModel = await db.SensorModels.FindAsync(id);
            if (sensorModel == null)
            {
                return NotFound();
            }

            db.SensorModels.Remove(sensorModel);
            await db.SaveChangesAsync();

            return Ok(sensorModel);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SensorModelExists(int id)
        {
            return db.SensorModels.Count(e => e.Id == id) > 0;
        }
    }
}
