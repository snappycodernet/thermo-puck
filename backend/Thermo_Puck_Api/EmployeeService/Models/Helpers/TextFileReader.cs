using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace Thermo_Puck.Models.Helpers
{
    public class TextFileReader
    {
        private const string FILE_PATH = @"M:\__Exchange\THAD\TestSensorReadings\";
        private const string FILE_NAME = @"TempProfilerData010419a.txt";

        public List<SensorModel> RetrieveCurrentData()
        {
            return FilterData();
        }

        private List<SensorModel> FilterData()
        {
            List<string> sensorData = new List<string>() { };

            foreach(string line in File.ReadLines(FILE_PATH + FILE_NAME))
            {
                sensorData.Add(line);
            }

            return GetParsedData(sensorData);
        }

        private List<SensorModel> GetParsedData(List<string> data)
        {
            List<SensorModel> sensorModels = new List<SensorModel>() { };

            foreach(string dataLine in data)
            {
                SensorModel model = new SensorModel();

                if(dataLine.Length > 0 && dataLine.Contains(",") && dataLine.Contains(":") && !dataLine.Contains(",,"))
                {
                    string[] splitData = dataLine.Split(',');

                    if(splitData.Length < 9)
                    {
                        double internalTemp = 0.00;
                        double externalTemp1 = 0.00;
                        double externalTemp2 = 0.00;
                        double battery = 0.00;
                        double range = 0.00;

                        double.TryParse(splitData[2], out internalTemp);
                        double.TryParse(splitData[3], out externalTemp1);
                        double.TryParse(splitData[4], out externalTemp2);
                        double.TryParse(splitData[5], out battery);
                        double.TryParse(splitData[splitData.Length - 1], out range);

                        model.MAC_Address = splitData[0];
                        model.Model = splitData[1];
                        model.InternalTemp = internalTemp;
                        model.ExternalTemp1 = externalTemp1;
                        model.ExternalTemp2 = externalTemp2;
                        model.BatteryPercentage = battery;
                        model.RangeSensorReading = range;

                        sensorModels.Add(model);
                    }
                }
            }

            return sensorModels;
        }
    }
}