const {manager} = require('../lib/model');
// 添加管理员
const add = async (val) => {
};
// 管理员列表
const list = async (ctx, next) => {
    let res;
    const params = ctx.request.params;
    res = await manager.findById(1);
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
