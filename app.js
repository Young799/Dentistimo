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
let topicResponse = "allnewappointment";

let data = [];

client.on("connect", () => {
  console.log("Connected Now!!");
  client.subscribe([topic], () => {
    console.log(`Subscribed to ${topic}`);
  });
});

client.on(
  "message",
  (topic, payload) => {
    // data = payload.toJSON();
    // for (item in data){
    // console.log(payload)}

    console.log(payload.toString());
    client.publish(topicResponse, "hi", { qos: 1, retain: false }, (error) => {
      if (error) {
        console.error(error);
      }
    })


    let request = JSON.parse(payload)
    let newRequest = {
      name: request.name,
      user: request.user,
      start: request.start,
      end: request.end,
      dentist: request.dentist,
      color: request.color,
      availableDentist: request.dentists
    }



    //get all appointment from the clinic 
    let numberOfAppointment = 0

    Appointment.find(
      { dentist: request.dentist },
      function (err, appointments) {
        if (err) {
          return next(err);
        }

        console.log("Appointemnts!!", appointments);
        appointments.array.forEach(appointment => {
          if (appointment.start == request.start) {
            numberOfAppointment++
          }
        }
        );
        if (numberOfAppointment < request.dentist) {
          //confirm the new booking
          let newAppointment = new Appointment(newRequest)
          newAppointment.save(function (error) {
            if (error) {
              console.log("unable to save the request")
            } console.log("successfully saved")
          })
        }



        let appointmentsJson = JSON.stringify(appointments);
        // let usersJson = users.toJSON();

        console.log("RESPONSE ", appointmentsJson);
        client.publish(
          topicResponse,
          appointmentsJson,
          { qos: 1, retain: false },
          (error) => {
            if (error) {
              console.error(error);
            }
          }
        );
      }
    );
  }

  // console.log("Message: ", topic, payload.toString());
);
