using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace Thermo_Puck.Models
{
    public class SensorModel
    {
        public int Id { get; set; }
        [Required]
        public string Model { get; set; }
    [Required]
    public string MAC_Address { get; set; }
    [Required]
        public double InternalTemp { get; set; }
        [Required]
        public double ExternalTemp1 { get; set; }
        [Required]
        public double ExternalTemp2 { get; set; }
        [Required]
        public double BatteryPercentage { get; set; }
        [Required]
        public double RangeSensorReading { get; set; }
        [Required]
        public double ChargeRate { get; set; }
        [Required]
        public DateTime readDate;

        public SensorModel()
        {
            readDate = DateTime.Now;
        }
    }
}
