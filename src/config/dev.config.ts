export default ()=>({
    port:process.env.PORT,
    db:{
        url:process.env.DB_URL
    }
})