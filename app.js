const mqtt = require("mqtt");
const mongoose = require("mongoose");

let mongoURI =
  process.env.MONGODB_URI ||
  "mongodb+srv://userone:123@cluster0.izgcz.mongodb.net/Dit355?retryWrites=true&w=majority";

mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err) {
      console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
      console.error(err.stack);
      process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
  }
);

//User
//Check

let Dentist = require("./models/Dentist");
const Appointment = require("./models/Appointment");

//MQTT
let options = { clientId: "mqtt03", clean: true };

let client = mqtt.connect("mqtt://localhost:1883", options);

let topic = "newappointment";
let topicResponse1 = "appointments/approved";
let topicResponse2 = "appointments/notapproved";

let data = [];

client.on("connect", () => {
  console.log("Connected Now!!");
  client.subscribe([topic], () => {
    console.log(`Subscribed to ${topic}`);
  });
});

client.on("message", (topic, payload) => {
  // data = payload.toJSON();
  // for (item in data){
  // console.log(payload)}

  console.log(payload.toString());

  let request = JSON.parse(payload);

  let numberOfDentists = request.numberOfDentists;
  let numberOfAppointments = 0;

  console.log("Dentists: ", numberOfDentists);

  let newRequest = {
    name: request.name,
    user: request.user,
    start: request.start,
    end: request.end,
    dentist: request.dentist,
    color: request.color,
  };

  console.log("New Request Incoming: ", newRequest);
  console.log("Current Dentist: ", request.dentist);

  //get all appointment from the clinic

  Appointment.find(
    { dentist: "61a37438f112e8155255a91b" },
    function (err, appointments) {
      if (err) {
        return next(err);
      }

      let appointmentsArray = appointments;

      console.log("Appointemnts!!", appointments);
      appointmentsArray.forEach((appointment) => {
        console.log(appointment.start);
        if (appointment.start == request.start) {
          numberOfAppointments++;
        }
      });
      console.log("Current Appointments ", numberOfAppointments);

      if (numberOfAppointments < numberOfDentists) {
        //confirm the new booking
        console.log("Slot Available!!!");

        let newAppointment = new Appointment(newRequest)

        newAppointment.save(function(error,savedAppointment){
          if(error){
            console.log(error)
          }

          console.log(savedAppointment)

        })
      } else {
        console.log("Huh??!!");
      }
    }
  );
});
