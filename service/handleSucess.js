const handleSucess ={
    
    handleSucess (res, data){
        res.send({
            status: true,
            data
        }).end();
    },
}
    
module.exports = handleSucess;