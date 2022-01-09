let Dentist = require("../models/Dentist");
const Appointment = require("../models/Appointment");

// let topic = "newappointment";
let topicResponse1 = "ui/approved";
let topicResponse2 = "ui/notapproved";
let topicResponse3 = "ui/allreadyapproved";

module.exports = {
  requestHandler: function (topic, payload) {



      return new Promise((resolve, reject) => {
        // Do something, maybe on the network or a disk

        // METHOD
        console.log(topic, payload.toString());

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
          issuance: request.issuance,
          color: request.color,
        };

        console.log("New Request Incoming: ", newRequest);
        console.log("Current Dentist: ", request.dentist);

        //get all appointment from the clinic

        Appointment.find(
          { dentist: request.dentist },
          function (err, appointments) {
            if (err) {
              return next(err);
            }

            let appointmentsArray = appointments;

            // console.log("Appointemnts!!", appointments);

            //Check Availability
            appointmentsArray.forEach((appointment) => {
              // console.log(appointment.start);
              if (appointment.start == request.start) {
                numberOfAppointments++;
              }

              //Duplicate User
              if (
                appointment.start == request.start &&
                appointment.user == request.user
              ) {
                numberOfAppointments = 99;
              }
            });
            console.log("Current Appointments ", numberOfAppointments);

            if (numberOfAppointments < numberOfDentists) {
              //confirm the new booking
              console.log("Slot Available");

              let newAppointment = new Appointment(newRequest);

              newAppointment.save(function (error, savedAppointment) {
                if (error) {
                  console.log(error);
                }

                console.log(savedAppointment);

                //Response

                let response = {
                  userid: request.user,
                  requestid: request.issuance,
                  time: request.start,
                };

                let responseString = JSON.stringify(response);

                client.publish(
                  topicResponse1,
                  responseString,
                  { qos: 1, retain: false },
                  (error) => {
                    if (error) {
                      console.error(error);
                    }
                  }
                );
              });

              resolve("New Appointment Confirmed")
            }
            //Fully Booked
            else if (numberOfAppointments == numberOfDentists) {
              console.log("Timeslot Is Fully Booked!");

              //Response

              let response = {
                userid: request.user,
                requestid: request.issuance,
                time: "none",
              };

              let responseString = JSON.stringify(response);

              client.publish(
                topicResponse2,
                responseString,
                { qos: 1, retain: false },
                (error) => {
                  if (error) {
                    console.error(error);
                  }
                }
              );

              reject()
            }
            //Double Booking
            else if (numberOfAppointments > numberOfDentists) {
              console.log("User Allready Has An Appointment At This Time");

              //Response

              let response = {
                userid: request.user,
                requestid: request.issuance,
                time: "none",
              };

              let responseString = JSON.stringify(response);

              client.publish(
                topicResponse3,
                responseString,
                { qos: 1, retain: false },
                (error) => {
                  if (error) {
                    console.error(error);
                  }
                }
              );

              reject()
            }
          }
        );
      });
  },
};

