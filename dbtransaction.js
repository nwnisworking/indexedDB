import DBStore from "./dbstore.js"

export default class DBTransaction{
	/**@type {IDBOpenDBRequest} */
	db

	/**@type {'success'|'upgradeneeded'} */
	type

	stores = {}

	get result(){ return this.db.result }

	get storeNames(){ return this.result.objectStoreNames }

	constructor(e){
		this.type = e.type
		this.db = e.target
		
		for(let name of this.storeNames){
			const tx = this.db.transaction || this.result.transaction(name, 'readwrite'),
			store = tx.objectStore(name)

			this.stores[name] = new DBStore(this, store)
		}
	}

	/**
	 * 
	 * @param {string} name 
	 * @param {string} keyPath 
	 * @param {boolean} autoIncrement 
	 * @returns {DBStore}
	 */
	store(name, keyPath, autoIncrement = false){
		if(!this.stores[name])
			this.stores[name] = new DBStore(this, this.result.createObjectStore(name, {keyPath, autoIncrement}))
		
		this.stores[name].transaction = this
		return this.stores[name]
	}
}