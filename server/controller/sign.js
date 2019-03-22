const userDao = require('../daos/user')
const crypto = require('crypto')
const log = require('../common/logger')
const uuid = require('uuid/v1')

const makeSalt = () => Math.round((new Date().valueOf() * Math.random())) + '';//generate salt
const encryptPass = (pass, salt) => crypto.createHash('md5').update(pass + salt).digest('hex');// generate md5

// exports.sign = async function (ctx, next) {
// 	ctx.render('sign.html');
// };

/**
 * user login
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.login = async function (ctx, next) {
	const { email, password } = ctx.request.body;
	try {
		const users = await userDao.query({ email });
		if (!users.length) {
			return ctx.body = {
				code: 2,
				message: '用户不存在'
			};
		}
		if (users[0].hash_password !== encryptPass(password, users[0].salt)) {
			return ctx.body = {
				code: 3,
				message: '密码错误'
			};
		}
		await ctx.sign({ uid: users[0].id, email });
		ctx.body = {
			code: 0,
			message: '登录成功',
			data: users[0]
		};
	} catch (err) {
		log.error(err);
		ctx.body = {
			code: -1,
			message: '服务器错误',
			err: err
		};
	}
};

/**
 * user register
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.register = async function (ctx, next) {
	const { email, password } = ctx.request.body;
	const salt = makeSalt();
	const hash_password = encryptPass(password, salt);
	const num = Math.round(Math.random() * 1000000);
	const form = { salt, hash_password, email, name: email,nick:email, num: num };

	try {
		const countRet = await userDao.count({ email });
		if (countRet[0].count > 0) {
			return ctx.body = {
				code: 2,
				message: '该邮箱已经被注册！',
				data: {}
			}
		}
		const id = uuid();
		const insertRet = await userDao.insert({ id, ...form });
		if (!insertRet.affectedRows) {
			return ctx.body = {
				code: 3,
				message: '注册失败！',
				data: {}
			}
		}
		ctx.sign({ uid: id, email }); //注册成功后立即登陆
		ctx.body = {
			code: 0,
			message: '注册成功！',
			data: { id, email, num, nick: email, signature: '' }
		}
	} catch (err) {
		log.error(err);
		ctx.body = {
			code: -1,
			message: '服务器错误',
			err: err
		};
	}
};

/**
 * user logout
 * 注销
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.logout = async function (ctx, next) {
	ctx.sign({ name: 'logout' }, 1);
	ctx.body = {
		code: 0,
		message: '注销成功'
	}
};