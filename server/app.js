/*
 *  API for study cards
 */


const express = require("express")
var cors = require('cors');
const database = require("./db-connector");


// Variables
const app = express();
const port = process.env.PORT || 3001;


// Same-origin policy option with cors
// see: https://web.dev/cross-origin-resource-sharing/
// React client runs on port 3000
app.use(cors('http://localhost:3000'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// GET request all study cards
app.get("/api/v1/cards", (req, res) => {
	database.retreiveAllCards().then((result) => {
		res.send(result);
	}, (error) => {
		res.status(500).send(error);
	});
});


//GET request all study categories
app.get("/api/v1/categories", (req, res) => {
	database.retreiveAllCategories().then((result) => {
		res.send(result);
	}, (error) => {
		res.status(500).send(error);
	});
});


// Listen for connections
app.listen(port, () => {
	console.log(`Server listening on port ${port}...`)
})