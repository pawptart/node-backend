import express = require('express');
import bodyParser = require('body-parser');
import { MongoClient, ObjectID } from 'mongodb';

// Express app config
const app = express();
const mongoUrl = 'mongodb+srv://test:test@cluster0-9igoz.mongodb.net/test?retryWrites=true&w=majority';
const port = process.env.PORT || 3000;

// body-parser config
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

let getNotes = (req: any, res: any) => {

	MongoClient.connect( mongoUrl, { useNewUrlParser: true }, (err: any, client: any) => {
		
		if (err) throw err;

		const db = client.db('note');

		let notePromise = () => {
			return new Promise((resolve, reject) => {
				db
					.collection('notes')
					.find({})
					.toArray(function(err: any, data: any) {
						if (err) throw err;
						resolve(data);
						});
			});
		}

		let callNotePromise = async () => {
			let result = await (notePromise());
			return result;
		}

		callNotePromise().then((result) => {

			client.close();
			res.json(result);

		});

	});

}

let createNote = (req: any, res: any) => {

	let data = req.body;

	MongoClient.connect( mongoUrl, { useNewUrlParser: true }, (err: any, client: any) => {

		if (err) throw err;

		const db = client.db('note');
		
		db.collection('notes').insertOne(data);

		client.close();
		res.send({status: "Success"});
	});	

}

let deleteNote = (req: any, res: any) => {

	let id = req.params.id;

	MongoClient.connect( mongoUrl, { useNewUrlParser: true }, (err: any, client: any) => {

		if (err) throw err;
		const db = client.db('note');
		
		db
			.collection('notes')
			.deleteOne({_id: new ObjectID(id)}, (err: any) => {
				if (err) throw err;
		});

		res.send("complete")
	
	});
	
}

// API endpoints for notes
app.get( '/api/notes', getNotes );
app.post( '/api/notes/create', createNote );
app.delete( '/api/notes/delete/:id', deleteNote );

app.listen( port, function () {
	console.log(`Server started, listening on port ${port}.`)
});

