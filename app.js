const mqtt = require("mqtt");
const mongoose = require("mongoose");
const CircuitBreaker = require("opossum");
const requestHandler = require('./controller/requestcontroller')

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

//MQTT
let optionsMQTT = { clientId: "mqtt03", clean: true };

global.client = mqtt.connect("mqtt://localhost:1883", optionsMQTT);

let topic = "newappointment";

//CIRCUIT BREAKER

const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};
const breaker = new CircuitBreaker(requestHandler.requestHandler, options);

//MQTT CONNECTION

client.on("connect", () => {
  console.log("Connected Now!!");
  client.subscribe([topic], () => {
    console.log(`Subscribed to ${topic}`);
  });
});

client.on("message", (topic, payload) => {
  breaker.fire(topic, payload).then(console.log).catch(console.error);
});
