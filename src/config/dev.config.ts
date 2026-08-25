export default ()=>({
    port:process.env.PORT,
    db:{
        url:process.env.DB_URL
    },
    encryptionKey :process.env.MOBILE_ENCRYPTION_KEY,
})