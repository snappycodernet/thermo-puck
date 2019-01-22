using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.IO;
using System.IO.Ports;
using System.Linq;
using System.Text;
using System.Threading;
using System.Web;

namespace Thermo_Puck.Models.Helpers
{
  public static class COMPortReader
  {
    private static SerialPort COMPort = new SerialPort("COM3", 115200);
    private static string tString = string.Empty;
    private static byte _terminator = 0x0D; // newline = 0x0A , carriage return = 0x0D 

    public static SensorModel ReadData()
    {
      if(!COMPort.IsOpen)
      {
        COMPort.Open();
      }
      COMPort.NewLine = "\r";
      COMPort.DataBits = 8;
      COMPort.Handshake = Handshake.None;
      COMPort.Parity = Parity.None;
      COMPort.StopBits = StopBits.One;
      COMPort.DataReceived -= new SerialDataReceivedEventHandler(DataReceivedHandler);
      COMPort.DataReceived += new SerialDataReceivedEventHandler(DataReceivedHandler);

      SensorModel model = new SensorModel(); 

      try
      {
        string data = COMPort.ReadLine();
        model = COMDataParser.GetParsedData(data);
      }
      catch(Exception ex)
      {
        Console.WriteLine(ex.Message);
      }

      return model;
    }

    private static void DataReceivedHandler(object sender, SerialDataReceivedEventArgs e)
    {
      try
      {
        byte[] buffer = new byte[COMPort.ReadBufferSize];

        //There is no accurate method for checking how many bytes are read 
        //unless you check the return from the Read method 
        int bytesRead = COMPort.Read(buffer, 0, buffer.Length);

        //For the example assume the data we are received is ASCII data. 
        tString += Encoding.ASCII.GetString(buffer, 0, bytesRead);
        //Check if string contains the terminator  
        if (tString.IndexOf((char)_terminator) > -1)
        {
          //If tString does contain terminator we cannot assume that it is the last character received 
          string workingString = tString.Substring(0, tString.IndexOf((char)_terminator));
          //Remove the data up to the terminator from tString 
          tString = string.Empty;
          //Do something with workingString 
          WriteDatabase(workingString);
        }
      }
      catch (DbEntityValidationException exerr)
      {
        foreach (var eve in exerr.EntityValidationErrors)
        {
          Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
              eve.Entry.Entity.GetType().Name, eve.Entry.State);
          foreach (var ve in eve.ValidationErrors)
          {
            Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                ve.PropertyName, ve.ErrorMessage);
          }
        }
      }
      catch (Exception ex)
      {
        Console.WriteLine("### Reading Error: " + Environment.NewLine + ex.Message);
      }
    }

    private static void WriteDatabase(string data)
    {
      Thermo_PuckContext db = new Thermo_PuckContext();
      SensorModel model = COMDataParser.GetParsedData(data);

      if (!string.IsNullOrEmpty(model.Model) && !string.IsNullOrEmpty(model.MAC_Address))
      {
        db.SensorModels.Add(model);
        db.SaveChanges();
      }
    }
  }
}
