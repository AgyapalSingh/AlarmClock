let setAlarmTimes = []; // Array to store set alarm times

// Function to update the clock display every second
function updateClock() {
  const clockElement = document.getElementById("clockTime");
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  clockElement.textContent = timeString;
}

// Update the clock initially and set interval to update it every second
updateClock();
setInterval(updateClock, 1000);

document.getElementById("setAlarm").addEventListener("click", function () {
  const alarmTimeInput = document.getElementById("alarmTime");
  const alarmTimeValue = alarmTimeInput.value;

  if (alarmTimeValue !== "") {
    // Check if the alarm time has already been set
    if (setAlarmTimes.includes(alarmTimeValue)) {
      alert("This alarm time has already been set.");
      return;
    }

    const now = new Date();
    const selectedTime = new Date(now.toDateString() + " " + alarmTimeValue);

    // Check if the selected time is in the past
    if (selectedTime.getTime() < now.getTime()) {
      // If so, set it for the next occurrence of that time
      selectedTime.setDate(selectedTime.getDate() + 1);
    }

    // Calculate time until alarm
    const timeUntilAlarm = selectedTime.getTime() - now.getTime();

    // Create and append alarm to the list
    const alarmsList = document.getElementById("alarmsList");
    const alarmItem = document.createElement("li");
    alarmItem.className = "list-group-item";
    alarmItem.dataset.time = selectedTime.getTime(); // Store time in data attribute for sorting
    alarmItem.innerHTML = `
            ${selectedTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
            <button class="btn btn-danger float-right deleteAlarm">Delete</button>
        `;
    alarmsList.appendChild(alarmItem);

    // Sort the alarms
    sortAlarms();

    // Set timeout to trigger alarm
    setTimeout(function () {
      alert("Time to wake up!");
      alarmItem.remove(); // Remove alarm after it goes off
      sortAlarms(); // Re-sort alarms after one is removed
      setAlarmTimes = setAlarmTimes.filter((time) => time !== alarmTimeValue); // Remove the alarm time from setAlarmTimes
    }, timeUntilAlarm);

    // Add the alarm time to setAlarmTimes array
    setAlarmTimes.push(alarmTimeValue);

    // Reset input values to null
    alarmTimeInput.value = null;
  } else {
    alert("Please enter a valid time for the alarm.");
  }
});

// Function to sort alarms by time
function sortAlarms() {
  const alarmsList = document.getElementById("alarmsList");
  const alarms = Array.from(alarmsList.children);
  alarms.sort((a, b) => a.dataset.time - b.dataset.time);

  alarmsList.innerHTML = "";
  alarms.forEach((alarm) => alarmsList.appendChild(alarm));
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("alarmsList").addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("deleteAlarm")) {
      const alarmItem = e.target.parentElement;
      alarmItem.remove(); // Remove the alarm when delete button is clicked
      sortAlarms(); // Re-sort alarms after one is removed

      // Remove the alarm time from setAlarmTimes
      const alarmTime = alarmItem.querySelector("span").textContent;
      setAlarmTimes = setAlarmTimes.filter((time) => time !== alarmTime);
    }
  });
});
