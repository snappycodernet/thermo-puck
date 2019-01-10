using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Thermo_Puck.Models
{
    public class SensorModel
    {
        public string MAC_Address { get; set; }
        public string Model { get; set; }
        public double InternalTemp { get; set; }
        public double ExternalTemp1 { get; set; }
        public double ExternalTemp2 { get; set; }
        public double BatteryPercentage { get; set; }
        public double RangeSensorReading { get; set; }
        public DateTime readDate;

        public SensorModel()
        {
            readDate = DateTime.Now;
        }
    }
}