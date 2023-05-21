export default class Store{
	/**@type {IDBObjectStore} */
	#store
	
	constructor(store){
		this.#store = store
	}

	/**
	 * @param {string} name 
	 * @param {string[]|string} key 
	 * @param {object} param
	 * @param {boolean} param.multi
	 * @param {boolean} param.unique
	 */
	index(name, key, {multi = false, unique = false} = {}){
		if(!this.#store.indexNames.contains(name))
			this.#store.createIndex(name, key ?? name, {multiEntry : multi, unique})
		return this
	}

	/**
	 * @param {string} name 
	 */
	deleteIndex(name){
		if(this.#store.indexNames.contains(name))
			this.#store.deleteIndex(name)
		return this
	}

	delete(){
		this.#store.transaction.db.deleteObjectStore(this.#store.name)
	}

}