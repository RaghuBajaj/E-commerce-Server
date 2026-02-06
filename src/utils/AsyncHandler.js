const asyncHandler = (fun) => {
    return (req, res, next) => {
        Promise
        .resolve(fun(req, res, next))
        .catch(error => console.log("error", error));
    }
}

export {asyncHandler};