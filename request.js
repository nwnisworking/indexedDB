export default class Request{
	/**@type {IDBObjectStore|IDBIndex} */
	#store

	constructor(store){
		this.#store = store

		return new Proxy(this, {
			get(t, v, r){
				return (...param)=>new Promise((res, rej)=>{
					const _ = t[v](...param)
					_.onerror = rej

					if(['add', 'put'].includes(v))
						_.onsuccess = e=>res(_)
					else if(['cursor', 'keyCursor'].includes(v))
						res(fn=>fn ? _.onsuccess = ()=>fn(_.result) : _)
					else
						_.onsuccess = e=>res(_.result)
				})
			}
		})
	}

	/**
	 * 
	 * @param {object} data 
	 * @param {string|string[]} key 
	 * @returns 
	 */
	add(data, key){
		if(this.isIndex() || this.isReadonly())
			return null

		return this.#store.add(...[data, this.hasKey() && data[this.#store.keyPath] ? undefined : key])
	}

	/**
	 * 
	 * @param {object} data 
	 * @param {string|string[]} key 
	 */
	put(data, key){
		if(this.isIndex() || this.isReadonly())
			return null

		return this.#store.put(...[data, this.hasKey() && data[this.#store.keyPath] ? undefined : key])
	}

	/**
	 * @param {IDBValidKey|IDBKeyRange} query 
	 */
	get(query){
		return this.#store.get(query)
	}

	/**
	 * @param {IDBValidKey|IDBKeyRange} query 
	 */
	getKey(query){
		return this.#store.getKey(query)
	}

	/**
	 * 
	 * @param {IDBValidKey|IDBKeyRange} query 
	 * @param {number} count 
	 * @returns 
	 */
	getAll(query, count){
		return this.#store.getAll(...[query, count])
	}

	/**
	 * 
	 * @param {IDBValidKey|IDBKeyRange} query 
	 * @param {number} count 
	 * @returns 
	 */
	getAllKeys(query, count){
		return this.#store.getAllKeys(...[query, count])
	}

	/**
	 * @param {IDBValidKey|IDBKeyRange} query 
	 * @param {IDBCursorDirection} dir 
	 */
	cursor(query, dir){
		return this.#store.openCursor(query, dir)
	}

	/**
	 * @param {IDBValidKey|IDBKeyRange} query 
	 * @param {IDBCursorDirection} dir 
	 */
	keyCursor(query, dir){
		return this.#store.openKeyCursor(query, dir)
	}
	
	hasKey(){
		return !!this.#store.keyPath
	}

	isIndex(){
		return this.#store instanceof IDBIndex
	}

	isReadonly(){
		return this.#store.transaction.mode === 'readonly'
	}

	isReadwrite(){
		return this.#store.transaction.mode === 'readwrite'
	}
}