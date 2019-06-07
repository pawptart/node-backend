import express = require('express');
import { MongoClient } from 'mongodb';

// Express app config
const app = express();
const port = 3000;
const mongoUrl = 'mongodb+srv://test:test@cluster0-9igoz.mongodb.net/test?retryWrites=true&w=majority';

let getNotes = (req: any, res: any) => {

	MongoClient.connect( mongoUrl, { useNewUrlParser: true }, (err: any) => {
		if (err) {
			console.log(err.message);
		} else {
			console.log("Successfully connected!");
		}
	});

}

// API endpoints

app.get( '/notes', getNotes );

app.listen( port, () => {
	console.log( `server started at http://localhost:${ port }` );
});

