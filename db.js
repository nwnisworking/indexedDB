import Transaction from "./transaction.js"

export default class DB{
	/**@type {string} */
	name

	/**@type {number} */
	version

	/**@type {IDBOpenDBRequest} */
	db

	get result(){ return this.db.result }

	constructor(name){
		this.name = name
	}

	/**
	 * @returns {Promise<Transaction>}
	 */
	open(){
		this.db = indexedDB.open(this.name)

		return new Promise((res, rej)=>{
			this.db.onerror = 
			this.db.onblocked = rej

			this.db.onsuccess = e=>res(new Transaction(this, 'success'))
		})
	}

	/**
	 * @param {number} version
	 * @returns {Promise<Transaction>}
	 */
	upgrade(version){
		this.db = indexedDB.open(this.name, version)

		return new Promise((res, rej)=>{
			this.db.onerror = 
			this.db.onblocked = rej

			this.db.onupgradeneeded = e=>res(new Transaction(this, 'upgradeneeded'))
		})
	}

	delete(){
		indexedDB.deleteDatabase(this.name)
	}

	close(){
		this.result?.close()
	}
}