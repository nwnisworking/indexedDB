import DB from "./db.js"
import Request from "./request.js"
import Store from "./store.js"

export default class Transaction{
	/**@type {'upgradeneeded'|'success'} */
	type

	/**@type {DB} */
	db

	constructor(db, type){
		this.type = type
		this.db = db
	}

	/**
	 * @param {string} name 
	 * @param {string|string[]} key 
	 * @param {boolean} increment 
	 */
	store(name, key, increment = false){
		const { db : { result, transaction } } = this.db

		const store = result.objectStoreNames.contains(name) ? 
			transaction.objectStore(name) : 
			result.createObjectStore(name, {keyPath : key, autoIncrement : increment})

		return new Store(store)
	}

	/**
	 * @param {string} store 
	 * @param {'readonly'|'readwrite'} mode 
	 */
	request(store, mode = 'readonly'){
		const { result } = this.db,
		[name, index] = store.split('.', 2),
		_ = result.transaction(name, mode).objectStore(name)

		if(index && _.indexNames.contains(index))
			return new Request(_.index(index))

		return new Request(_)
	}
}