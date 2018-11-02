const config = {
    // 启动端口
    port: 3000,
    database: {
        DATABASE: 'test',
        USERNAME: 'root',
        PASSWORD: '123456',
        PORT: '3306',
        HOST: 'localhost'
    },
    manager: {
        invalid: 0,
        tablename: 'amanagers'
    },
    tables: [
        'manager',
    ],
    methods: [
        'get',
        'post'
    ]
};

module.exports = config;
