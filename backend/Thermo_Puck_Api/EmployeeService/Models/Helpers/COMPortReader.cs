using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Ports;
using System.Linq;
using System.Web;

namespace Thermo_Puck.Models.Helpers
{
  public class COMPortReader
  {
    private SerialPort COMPort = new SerialPort("COM3", 115200);
    public string DataPacket { get; set; } = "";

    public SensorModel ReadData()
    {
      try
      {
        if(!COMPort.IsOpen)
        {
          COMPort.Open();

          DataPacket = COMPort.ReadLine();
        }
      }
      catch(InvalidOperationException) { return null; }
      catch(UnauthorizedAccessException) { throw new Exception("UnauthorizedAccess"); }
      catch(IOException) { return null; }
      finally
      {
        COMPort.Close();
      }

      return GenerateFilteredDataPacket(DataPacket);
    }

    private SensorModel GenerateFilteredDataPacket(string dataPacket)
    {
      SensorModel model = new SensorModel();

      if (dataPacket.Length > 0 && dataPacket.Contains(",") && dataPacket.Contains(":") && !dataPacket.Contains(",,"))
      {
        string[] splitData = dataPacket.Split(',');

        if (splitData.Length < 10)
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
        }
      }

      return model;
    }
  }
}
