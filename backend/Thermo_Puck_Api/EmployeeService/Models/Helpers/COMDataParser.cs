using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace Thermo_Puck.Models.Helpers
{
    public static class COMDataParser
    {
        public static SensorModel GetParsedData(string data)
        {
            SensorModel model = new SensorModel();

            if(data.Length > 0 && data.Contains(",") && data.Contains(":") && !data.Contains(",,"))
            {
                string[] splitData = data.Split(',');

                if(splitData.Length < 10)
                {
                  double internalTemp = 0.00;
                  double externalTemp1 = 0.00;
                  double externalTemp2 = 0.00;
                  double battery = 0.00;
                  double range = 0.00;
                  double chargeRate = 0.00;

                  double.TryParse(splitData[2], out internalTemp);
                  double.TryParse(splitData[3], out externalTemp1);
                  double.TryParse(splitData[4], out externalTemp2);
                  double.TryParse(splitData[5], out battery);
                  double.TryParse(splitData[splitData.Length - 1], out range);
                  double.TryParse(splitData[6], out chargeRate);

                  model.MAC_Address = splitData[0];
                  model.Model = splitData[1];
                  model.InternalTemp = internalTemp;
                  model.ExternalTemp1 = externalTemp1;
                  model.ExternalTemp2 = externalTemp2;
                  model.BatteryPercentage = battery;
                  model.RangeSensorReading = range;
                  model.ChargeRate = chargeRate;
                  model.ReadDate = DateTime.Now;
                }
            }

            return model;
        }
    }
}
