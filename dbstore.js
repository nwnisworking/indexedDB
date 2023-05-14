import DBTransaction from "./dbtransaction.js"

export default class DBStore{
	/**@type {IDBObjectStore} */
	store

	get keyPath(){ return this.store.keyPath }

	get autoIncrement(){ return this.store.autoIncrement }

	get name(){ return this.store.name }

	/**@type {DBTransaction} */
	transaction

	/**@param {DBTransaction} transaction */
	/**@param {IDBObjectStore} store */
	constructor(transaction, store){
		this.transaction = transaction
		this.store = store
	}

	add(data, key){
		this.store.add(data, data[this.keyPath] ? undefined : key)
		return this
	}

	put(data, key){
		this.store.put(data, data[this.keyPath] ? undefined : key)
		return this
	}

	bulkInsert(arr, onComplete = null){
		let i = 0,
		put = ()=>{
			if(i < arr.length){this.store.put(arr[i]).onsuccess = put; i++}
			else 
				if(onComplete && typeof onComplete === 'function') 
					onComplete(this)
		}

		put()
		return this
	}

	/**
	 * 
	 * @param {IDBKeyRange|IDBValidKey|string} key 
	 * @returns {Promise}
	 */
	get(key){
		return new Promise((res, rej)=>{
			const q = this.store.get(key)

			q.onerror = rej
			q.onsuccess = e=>res(q.result)
		})
	}

	/**
	 * 
	 * @param {IDBKeyRange|IDBValidKey|null} key 
	 * @returns 
	 */
	getAll(key = null){
		return new Promise((res, rej)=>{
			const q = this.store.getAll(key)

			q.onerror = rej
			q.onsuccess = e=>res(q.result)
		})
	}

	index(name){
		return this.store.index(name)
	}

	createIndex(name, key, {unique = false, multi = false} = {}){
		if(!this.store.indexNames.contains(name))
			this.store.createIndex(name, key, {multiEntry : multi, unique})

		return this
	}

	deleteIndex(name){
		if(this.store.indexNames.contains(name))
			this.store.deleteIndex(name)
		return this
	}

	deleteStore(){
		this.transaction.result.deleteObjectStore(this.name)
		return
	}
}