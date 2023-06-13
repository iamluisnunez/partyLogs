const newPartyForm = document.querySelector("#new-party-form");
const partyContainer = document.querySelector("#party-container");

const PARTIES_API_URL =
  "http://fsa-async-await.herokuapp.com/api/workshop/parties";
const GUESTS_API_URL =
  "http://fsa-async-await.herokuapp.com/api/workshop/guests";
const RSVPS_API_URL = "http://fsa-async-await.herokuapp.com/api/workshop/rsvps";
const GIFTS_API_URL = "http://fsa-async-await.herokuapp.com/api/workshop/gifts";

// get all parties
const getAllParties = async () => {
  try {
    const response = await fetch(`${PARTIES_API_URL}`);
    const parties = await response.json();
    return parties;
  } catch (error) {
    console.error(error);
  }
};

// get single party by id
const getPartyById = async (id) => {
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`);
    const party = await response.json();
    return party;
  } catch (error) {
    console.error(error);
  }
};

// delete party
const deleteParty = async (id) => {
  // your code here
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("Data deleted successfully.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const renderSinglePartyById = async (id) => {
  try {
    // Fetch party details from server
    const party = await getPartyById(id);

    // GET - /api/workshop/guests/party/:partyId - Get guests by party ID
    const guestsResponse = await fetch(`${GUESTS_API_URL}/${id}`);
    console.log(guestsResponse.body);
    const guests = await guestsResponse.json();

    // GET - /api/workshop/rsvps/party/:partyId - Get RSVPs by party ID
    const rsvpsResponse = await fetch(`${RSVPS_API_URL}/${id}`);
    const rsvps = await rsvpsResponse.json();

    // GET - /api/workshop/parties/gifts/:partyId - Get all gifts by party ID
    const giftsResponse = await fetch(`${GIFTS_API_URL}/workshop/gifts/${id}`);
    const gifts = await giftsResponse.json();

    // Create a new HTML element to display party details
    const partyDetailsElement = document.createElement("div");
    partyDetailsElement.classList.add("party-details");
    partyDetailsElement.innerHTML = `
      <h2>${party.title}</h2>
      <p>${party.event}</p>
      <p>${party.city}</p>
      <p>${party.state}</p>
      <p>${party.country}</p>
      <h3>Guests:</h3>
      <ul>
        ${guests
          .map(
            (guest, index) => `
              <li>
                <div>${guest.name}</div>
                <div>${rsvps[index].status}</div>
              </li>
            `
          )
          .join("")}
      </ul>
      <button class="close-button">Close</button>
    `;
    partyContainer.appendChild(partyDetailsElement);

    // Add event listener to the close button
    const closeButton = partyDetailsElement.querySelector(".close-button");
    closeButton.addEventListener("click", () => {
      partyDetailsElement.remove();
    });
  } catch (error) {
    console.error(error);
  }
};

const renderParties = async (parties) => {
  try {
    partyContainer.innerHTML = "";
    parties.forEach((party) => {
      if (!Array.isArray(parties)) {
        throw new Error("Parties is not an array.");
      }
      const partyElement = document.createElement("div");
      partyElement.classList.add("party");
      partyElement.innerHTML = `
        <h2>${party.name}</h2>
        <p>${party.description}</p>
        <p>${party.date}</p>
        <p>${party.time}</p>
        <p>${party.location}</p>
        <button class="details-button" data-id="${party.id}">See Details</button>
        <button class="delete-button" data-id="${party.id}">Delete</button>
      `;
      partyContainer.appendChild(partyElement);

      // see details
      const detailsButton = partyElement.querySelector(".details-button");
      detailsButton.addEventListener("click", (event) => {
        // your code here
        const partyId = event.target.dataset.id;
        renderSinglePartyById(party.id);
      });

      // delete party
      const deleteButton = partyElement.querySelector(".delete-button");
      deleteButton.addEventListener("click", async () => {
        // your code here
        const partyID = partyElement.getAttribute("data-id");
        deleteParty(party.id);
        await renderParties(await getAllParties());
      });
    }); // <-- Add this closing bracket
  } catch (error) {
    console.error(error);
  }
};

// init function
const init = async () => {
  // your code here
  await renderParties(await getAllParties());
};

init();
