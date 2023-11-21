import mongoose from "mongoose";
export default class Database {
    constructor(url) {
        this.connect(url).then(() => {
            console.log( '✔ Database Connected' );
        } ).catch( ( err ) => {
            console.error( '✘ MONGODB ERROR: ', err.message );
        } );
    }

    async connect( url ) {
        try {
            await mongoose.connect(url);
        } catch ( e ) {
            throw e;
        }
    }
}