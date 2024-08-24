const responseWithData = (res, statusCode, data) => res.status(statusCode).json(data);

const ok = (res, data, title = null) => {
    resp_title = 'OK!'
    if(title !== null) {
        resp_title = title
    } 

    responseWithData(res, 200, {
        status: 200,
        message: resp_title,
        data: data
    })
}

const forbidden = (res, data) => responseWithData(res, 403, {
    status: 403,
    message: "Forbidden Access",
    data: data
})

const unauthorized = (res, data) => responseWithData(res, 401, {
    status: 401,
    message: "Unauthorized"
})

const created = (res, data, title = null) => {
    resp_title = "Successfully Created"
    if(title !== null) {
        resp_title = title
    } 

    responseWithData(res, 201, {
        status: 201,
        message: resp_title,
        data: data
    });
}

const error = (res, data) => responseWithData(res, 500, {
    status: 500,
    message: "Oops! some error occurred"
})

const badRequest = (res, data) => responseWithData(res, 400, {
    status: 400,
    message: data
})

module.exports = {
    ok, 
    created, 
    unauthorized, 
    error, 
    badRequest, 
    forbidden
}