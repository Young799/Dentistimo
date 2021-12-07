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
    }),
      Appointment.find(
        { dentist: payload.toString() },
        function (err, appointment) {
          if (err) {
            return next(err);
          }

          console.log("Appointemnts!!", appointment);

          let appointmentsJson = JSON.stringify(appointment);
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
