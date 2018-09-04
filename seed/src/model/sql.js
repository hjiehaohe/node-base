const db = require('../lib/db')();

class Model {

    constructor(table) {
        this.TABLE = table;
    }

    // only accept 2 parameters
    get(params, operation, obj) {
        let query = db(this.TABLE).select().limit(20);
        switch (arguments.length) {
            case 1:
                {
                    query.where(params);
                    break;
                }
            case 2:
                {
                    query.where(params, operation);
                    break;
                }
            case 3:
                {
                    query.where(params, operation, obj);
                    break;
                }
            default:
                {
                    break;
                }
        }
        return query;
    }

    getById(id) {
        return db.select().from(this.TABLE).where('id', id);
    }

    insert(params) {
        return db(this.TABLE).insert(params)
    }

    update(updateValue, params) {
        return db(this.TABLE).update(updateValue).where(params);
    }

    updateMany(updateValue, params) {
        return db(this.TABLE).update(updateValue).whereIn(params);
    }

    delete(id) {
        return db(this.TABLE).delete().where('id', id);
    }

    deleteMany(ids) {
        return db(this.TABLE).delete().whereIn('id', ids);
    }

    getDB() {
        return db(this.TABLE);
    }

    getConn() {
        return db;
    }
}
module.exports = Model;