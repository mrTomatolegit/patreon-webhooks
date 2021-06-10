'use strict';
class PatreonAPIError extends Error {
    constructor(errorData) {
        super(
            `${errorData.code}, ${errorData.title}\nError ID: ${errorData.id}\nDetail: ${errorData.detail}`
        );
        this.code = errorData.code;
        this.codeName = errorData.code_name;
        this.detail = errorData.detail;
        this.id = errorData.id;
        this.status = errorData.status;
        this.title = errorData.title;
    }

    static parse(apiObject) {
        const errors = apiObject.errors;
        if (!errors) return;
        return errors.map(e => new PatreonAPIError(e));
    }
}

module.exports = PatreonAPIError;
