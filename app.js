import { movieList, seatDetails } from "./db.js";

console.log(movieList);
console.log(seatDetails);

const movieSelected = document.querySelector("#movie");
const seatsContainer = document.querySelector(".cinema-container .seats");
const resetBtn = document.querySelector(".reset");
const counter = document.querySelector("#counter");
const price = document.querySelector("#price");

let ticketPrice = null;
let allSeats = null;

const updatePriceAndCounter = () => {
	const selectedSeats = document.querySelectorAll(
		".seats .available-seat.selected"
	);

	counter.innerText = selectedSeats.length;
	price.innerText = `${selectedSeats.length * ticketPrice} EUR`;
};

const updateSelectedSeatsList = () => {
	const selectedSeats = document.querySelectorAll(
		".seats .available-seat.selected"
	);

	const selectedSeatsIndexes = [...selectedSeats].map((seat) =>
		[...allSeats].indexOf(seat)
	);

	localStorage.setItem(
		"selectedSeatsIndexes",
		JSON.stringify(selectedSeatsIndexes)
	);
};

const populateMovieList = () => {
	movieList.movies.forEach((movie) => {
		const option = document.createElement("option");
		option.setAttribute("value", movie.price);
		option.innerText = `${movie.title} (${movie.price} EUR)`;
		movieSelected.appendChild(option);
	});

	ticketPrice = movieSelected.value;
};

const populateSeats = () => {
	const seatsNumber = seatDetails.rows * seatDetails.columns;
	for (let i = 0; i < seatsNumber; i++) {
		const seat = document.createElement("div");
		seat.classList.add("available-seat");
		if (seatDetails.occupied.includes(i)) {
			seat.classList.add("occupied");
		}
		seatsContainer.appendChild(seat);
	}

	allSeats = document.querySelectorAll(".seats .available-seat");
};

const populateFromLocalStorage = () => {
	const selectedSeatsIndexes = JSON.parse(
		localStorage.getItem("selectedSeatsIndexes")
	);

	if (selectedSeatsIndexes !== null && selectedSeatsIndexes.length > 0) {
		allSeats.forEach((seat, index) => {
			if (selectedSeatsIndexes.indexOf(index) > -1) {
				seat.classList.add("selected");
			}
		});
	}

	const selectedMovieIndex = localStorage.getItem("selectedMovieIndex");

	if (selectedMovieIndex !== null) {
		movieSelected.selectedIndex = selectedMovieIndex;
		ticketPrice = movieSelected.value;
	}

	updatePriceAndCounter();
};

const populateUI = () => {
	populateMovieList();
	populateSeats();

	populateFromLocalStorage();
};

populateUI();

movieSelected.addEventListener("change", (e) => {
	ticketPrice = e.target.value;
	localStorage.setItem("selectedMovieIndex", movieSelected.selectedIndex);
	updatePriceAndCounter();
});

seatsContainer.addEventListener("click", (e) => {
	if (
		e.target.classList.contains("available-seat") &&
		!e.target.classList.contains("occupied")
	) {
		e.target.classList.toggle("selected");
		updatePriceAndCounter();
		updateSelectedSeatsList();
	}
});

resetBtn.addEventListener("click", () => {
	document
		.querySelectorAll(".seats .available-seat.selected")
		.forEach((seat) => {
			seat.classList.remove("selected");
		});

	movieSelected.selectedIndex = 0;
	ticketPrice = movieSelected.value;
	updatePriceAndCounter();
	localStorage.clear();
});
