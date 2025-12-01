import { Client, Databases, ID, Query } from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;


const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // My Appwrite endpoint
    .setProject(PROJECT_ID);                     // My project ID

const database = new Databases(client);    

export const updateSearchCount = async (searchTerm, movie) => {

    // 1. Use Appwrite SDK to chekc if a document already exists for the search term
    try {
        const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [Query.equal('searchTerm', searchTerm),])

        // 2. If it does, update the count field by 1
        if (result.documents.length > 0) {
            const doc = result.documents[0];

            await database.updateDocument(DATABASE_ID, TABLE_ID, doc.$id, {
                count: doc.count + 1,
            })
            // 3. If it doesn't, create a new document for the search term and increment count to 1
        } else {
            await database.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), {
                searchTerm: searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            })
        }
    } catch (error) {
        console.error(error);
    }
    
    console.log(PROJECT_ID, DATABASE_ID, TABLE_ID);
}

export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
            Query.limit(5),
            Query.orderDesc("count")
        ]);
        return result.documents || [];
    } catch (error) {
        console.error(error);
    }
}