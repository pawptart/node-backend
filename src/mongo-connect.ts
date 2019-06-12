import { MongoClient } from 'mongodb';

export async function mongoConnect(url: string, dbName: string ) {
	const client = await MongoClient.connect(url, { useNewUrlParser: true });
	const db = client.db(dbName);

	return Promise.resolve({ mongoDb: db, mongoClient: client});
}