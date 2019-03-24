/**
 * mysql database config
 * @type {Object}
 */
module.exports={
	host: "localhost",
	port: "3306",
	user: "root",
	password: "jianfeng",
	database: "chatdb",
	charset : 'utf8mb4',//utf8mb4 才能保存emoji
	connectionLimit: 100
};