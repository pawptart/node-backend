import express = require('express');
import { MongoClient } from 'mongodb';

// Express app config
const app = express();
const port = 3000;
const mongoUrl = 'mongodb+srv://test:test@cluster0-9igoz.mongodb.net/test?retryWrites=true&w=majority';

let getNotes = (req: any, res: any) => {

	MongoClient.connect( mongoUrl, { useNewUrlParser: true }, (err: any, client: any) => {
		
		if (err) throw err;

		var db = client.db('note');

		var notes = db.collection('notes').find({});

		notes.each( (err: any, note: any) => {
			console.log(note);
		});

		client.close();
	});

}

let createNote = (req: any, res: any) => {

	MongoClient.connect( mongoUrl, { useNewUrlParser: true }, (err: any, client: any) => {

		if (err) throw err;

		var db = client.db('note');
		
		db.collection('notes').insertOne({
			title: "Testing!",
			content: "This is just a test, for real." 
		});

		client.close();
	});	

}

// API endpoints

app.get( '/notes', getNotes );
app.get( '/notes/create', createNote );

app.listen( port, () => {
	console.log( `server started at http://localhost:${ port }` );
});

