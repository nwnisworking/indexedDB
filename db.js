import DBTransaction from "./dbtransaction.js"

export default class DB{
	/**@type {IDBOpenDBRequest} */
	db

	/**@type {string} */
	name

	constructor(name){
		this.name = name
	}

	/**@return {DBTransaction} */
	open(){
		this.db = indexedDB.open(this.name)
		
		return new Promise((res, rej)=>{
			this.db.onerror =
			this.db.onblocked = rej

			this.db.onsuccess = e=>res(new DBTransaction(e))
		})
	}

	/**
	 * 
	 * @param {number} version 
	 * @returns {Promise<DBTransaction>}
	 */
	upgrade(version){
		this.db = indexedDB.open(this.name, version)

		return new Promise((res, rej)=>{
			this.db.onerror = 
			this.db.onblocked = rej

			this.db.onupgradeneeded = e=>res(new DBTransaction(e))
		})
	}
}