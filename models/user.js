'use strict'

class User{
    constructor(user_id,email,name,phone)
    {
        this.user_id = user_id
        this.email = email
        this.name = name
        this.phone = phone
    }
}

module.exports = User