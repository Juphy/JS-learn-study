const {manager} = require('../lib/model');
// 添加管理员
const add = async (ctx, next) => {
    console.log('设置session');
    ctx.session.manager = {
        id: 2,
        name: '高祖辉',
        nick_name: 'Juphy',
        password: '123123',
        phone: 1123123123,
        create_time: new Date()
    };
    ctx.body = {
        username: 'Juphy'
    };
};
// 管理员列表
const list = async (ctx, next) => {
    let res;
    console.log(ctx.session.manager);
    const params = ctx.request.params;
    res = await manager.findAll();
    ctx.body = res;
};

// 删除管理员
const del = async (val) => {

};

// 编辑管理员
const edit = async (val) => {

};

// 登录
const login = async (val) => {

};

module.exports = {
    add,
    list,
    del,
    edit,
    login
};
